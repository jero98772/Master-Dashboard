from flask import Flask, render_template, jsonify, request
from datetime import datetime
import json
import os

app = Flask(__name__)

# JSON file path
DATA_FILE = 'user_data.json'

# Default user data structure
DEFAULT_USER_DATA = {
    'fp': 0,
    'minutes': 0,
    'hearts': 3,
    'privacy': False,
    'streaks': {
        'porn': 0,
        'routine': 0,
        'code': 0
    },
    'combo': 0,
    'multiplier': 1.0,
    'quickWins': [False, False, False, False],
    'completedPomodoros': 0,
    'cycleCount': 0,
    'timeData': {
        'work': {'minutes': 0, 'percentage': 0},
        'coding': {'minutes': 0, 'percentage': 0},
        'learning': {'minutes': 0, 'percentage': 0},
        'exercise': {'minutes': 0, 'percentage': 0},
        'other': {'minutes': 0, 'percentage': 0}
    },
    'waffleData': {},  # { 'YYYY-MM-DD': pomodoros_count }
    'lastResetDate': datetime.now().strftime('%Y-%m-%d'),
    'lastLoginDate': datetime.now().strftime('%Y-%m-%d'),
    'yesterdayStreaks': {
        'porn': None,
        'routine': None,
        'code': None
    },
    'last_updated': datetime.now().isoformat()
}

def load_user_data():
    """Load user data from JSON file"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
                print(f"Loaded data from {DATA_FILE}")
                return data
        except json.JSONDecodeError:
            print(f"Error reading {DATA_FILE}, using default data")
            return DEFAULT_USER_DATA.copy()
    else:
        print(f"{DATA_FILE} not found, creating with default data")
        save_user_data(DEFAULT_USER_DATA)
        return DEFAULT_USER_DATA.copy()

def save_user_data(data):
    """Save user data to JSON file"""
    data['last_updated'] = datetime.now().isoformat()
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {DATA_FILE}")
        return True
    except Exception as e:
        print(f"Error saving data: {e}")
        return False

# Load initial data
user_data = load_user_data()

@app.route('/')
def index():
    """Render the main productivity tracker page"""
    return render_template('index.html', user_data=user_data)

@app.route('/api/user-data', methods=['GET'])
def get_user_data():
    """API endpoint to get user data"""
    return jsonify(user_data)

@app.route('/api/user-data', methods=['POST'])
def update_user_data():
    """API endpoint to update user data"""
    global user_data
    data = request.json
    user_data.update(data)
    save_user_data(user_data)
    return jsonify({'success': True, 'data': user_data})

@app.route('/api/save-progress', methods=['POST'])
def save_progress():
    """Save user progress (FP, streaks, etc.)"""
    global user_data
    data = request.json
    
    # Update user data
    if 'fp' in data:
        user_data['fp'] = data['fp']
    if 'minutes' in data:
        user_data['minutes'] = data['minutes']
    if 'streaks' in data:
        user_data['streaks'].update(data['streaks'])
    if 'hearts' in data:
        user_data['hearts'] = data['hearts']
    if 'combo' in data:
        user_data['combo'] = data['combo']
    if 'multiplier' in data:
        user_data['multiplier'] = data['multiplier']
    if 'quickWins' in data:
        user_data['quickWins'] = data['quickWins']
    if 'privacy' in data:
        user_data['privacy'] = data['privacy']
    if 'timeData' in data:
        user_data['timeData'] = data['timeData']
    if 'completedPomodoros' in data:
        user_data['completedPomodoros'] = data['completedPomodoros']
        
        # Update today's waffle data in real-time
        today = datetime.now().strftime('%Y-%m-%d')
        waffle_data = user_data.get('waffleData', {})
        waffle_data[today] = data['completedPomodoros']
        user_data['waffleData'] = waffle_data
    if 'cycleCount' in data:
        user_data['cycleCount'] = data['cycleCount']
    
    save_user_data(user_data)
    
    return jsonify({
        'success': True,
        'message': 'Progress saved successfully',
        'data': user_data
    })

@app.route('/api/add-fp', methods=['POST'])
def add_fp():
    """Add FP to user account"""
    global user_data
    data = request.json
    amount = data.get('amount', 0)
    source = data.get('source', 'unknown')
    
    user_data['fp'] += amount
    save_user_data(user_data)
    
    return jsonify({
        'success': True,
        'message': f'Added {amount} FP from {source}',
        'data': user_data
    })

@app.route('/api/purchase', methods=['POST'])
def purchase_item():
    """Handle FP store purchases"""
    global user_data
    data = request.json
    item_type = data.get('type')
    cost = data.get('cost')
    
    if user_data['fp'] < cost:
        return jsonify({
            'success': False,
            'message': 'Insufficient FP'
        }), 400
    
    # Deduct FP
    user_data['fp'] -= cost
    
    # Apply item effect
    if item_type == 'heart':
        user_data['hearts'] = min(user_data['hearts'] + 1, 1)  # Max 1 heart
    elif item_type == 'skip':
        # Logic for skipping task
        pass
    elif item_type == 'yuri':
        # Photo purchase (handled in frontend)
        pass
    
    save_user_data(user_data)
    
    return jsonify({
        'success': True,
        'message': f'Purchased {item_type}',
        'data': user_data
    })

@app.route('/api/increment-streak', methods=['POST'])
def increment_streak():
    """Increment a streak counter"""
    global user_data
    data = request.json
    streak_type = data.get('type')  # 'porn', 'routine', or 'code'
    
    if streak_type in user_data['streaks']:
        user_data['streaks'][streak_type] += 1
        save_user_data(user_data)
    
    return jsonify({
        'success': True,
        'data': user_data
    })

@app.route('/api/quick-win', methods=['POST'])
def complete_quick_win():
    """Complete a quick win task"""
    global user_data
    data = request.json
    index = data.get('index')
    fp = data.get('fp')
    
    if 0 <= index < len(user_data['quickWins']):
        user_data['quickWins'][index] = True
        user_data['fp'] += fp
        user_data['combo'] += 1
        
        # Calculate multiplier
        combo = user_data['combo']
        if combo >= 5:
            user_data['multiplier'] = 2.0
        elif combo >= 3:
            user_data['multiplier'] = 1.5
        else:
            user_data['multiplier'] = 1.0
        
        save_user_data(user_data)
        
        return jsonify({
            'success': True,
            'message': f'Quick win completed! +{fp} FP',
            'data': user_data
        })
    
    return jsonify({
        'success': False,
        'message': 'Invalid quick win index'
    }), 400

@app.route('/api/update-combo', methods=['POST'])
def update_combo():
    """Update combo and multiplier"""
    global user_data
    data = request.json
    
    user_data['combo'] = data.get('combo', 0)
    user_data['multiplier'] = data.get('multiplier', 1.0)
    save_user_data(user_data)
    
    return jsonify({
        'success': True,
        'data': user_data
    })

@app.route('/api/reset-quick-wins', methods=['POST'])
def reset_quick_wins():
    """Reset quick wins (call daily)"""
    global user_data
    user_data['quickWins'] = [False, False, False, False]
    save_user_data(user_data)
    
    return jsonify({
        'success': True,
        'message': 'Quick wins reset',
        'data': user_data
    })

@app.route('/api/export', methods=['GET'])
def export_data():
    """Export user data as JSON"""
    return jsonify({
        'success': True,
        'data': user_data,
        'exported_at': datetime.now().isoformat()
    })

@app.route('/api/import', methods=['POST'])
def import_data():
    """Import user data from JSON"""
    global user_data
    data = request.json
    
    if 'data' in data:
        user_data = data['data']
        save_user_data(user_data)
        return jsonify({
            'success': True,
            'message': 'Data imported successfully',
            'data': user_data
        })
    
    return jsonify({
        'success': False,
        'message': 'Invalid import data'
    }), 400

@app.route('/api/reset-all', methods=['POST'])
def reset_all():
    """Reset all data to default (use with caution!)"""
    global user_data
    user_data = DEFAULT_USER_DATA.copy()
    save_user_data(user_data)
    
    return jsonify({
        'success': True,
        'message': 'All data reset to default',
        'data': user_data
    })

@app.route('/api/hacker-news', methods=['GET'])
def get_hacker_news():
    """Fetch top 10 Hacker News stories"""
    import requests
    
    try:
        # Get top 10 story IDs
        stories_response = requests.get('https://hacker-news.firebaseio.com/v0/newstories.json', timeout=5)
        story_ids = stories_response.json()[:10]
        
        stories = []
        for story_id in story_ids:
            # Fetch each story
            story_response = requests.get(f'https://hacker-news.firebaseio.com/v0/item/{story_id}.json', timeout=5)
            story = story_response.json()
            
            if story:
                stories.append({
                    'id': story.get('id'),
                    'title': story.get('title', 'No title'),
                    'url': story.get('url') or f"https://news.ycombinator.com/item?id={story.get('id')}",
                    'score': story.get('score', 0),
                    'by': story.get('by', 'unknown')
                })
        
        return jsonify({
            'success': True,
            'stories': stories
        })
    
    except Exception as e:
        print(f"Error fetching Hacker News: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/check-daily-reset', methods=['POST'])
def check_daily_reset():
    """Check if daily reset is needed and perform it"""
    global user_data
    
    try:
        today = datetime.now().strftime('%Y-%m-%d')
        last_reset = user_data.get('lastResetDate')
        
        # Check if it's a new day
        if last_reset != today:
            # Save yesterday's data to waffle
            yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            waffle_data = user_data.get('waffleData', {})
            waffle_data[yesterday] = user_data.get('completedPomodoros', 0)
            
            # Reset daily items
            user_data['quickWins'] = [False, False, False, False]
            user_data['completedPomodoros'] = 0
            user_data['cycleCount'] = 0
            user_data['combo'] = 0
            user_data['multiplier'] = 1.0
            
            # Move today's time to history and reset
            user_data['timeData'] = {
                'work': {'minutes': 0, 'percentage': 0},
                'coding': {'minutes': 0, 'percentage': 0},
                'learning': {'minutes': 0, 'percentage': 0},
                'exercise': {'minutes': 0, 'percentage': 0},
                'other': {'minutes': 0, 'percentage': 0}
            }
            
            # Set yesterday's streaks for user to complete
            user_data['yesterdayStreaks'] = {
                'porn': None,
                'routine': None,
                'code': None
            }
            
            user_data['waffleData'] = waffle_data
            user_data['lastResetDate'] = today
            
            save_user_data(user_data)
            
            return jsonify({
                'success': True,
                'reset_performed': True,
                'message': 'Daily reset completed',
                'data': user_data
            })
        
        return jsonify({
            'success': True,
            'reset_performed': False,
            'data': user_data
        })
    
    except Exception as e:
        print(f"Error in daily reset: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/complete-yesterday', methods=['POST'])
def complete_yesterday():
    """Mark yesterday's streak as completed or failed"""
    global user_data
    
    try:
        data = request.get_json()
        category = data.get('category')
        completed = data.get('completed')  # True or False
        
        if not category:
            return jsonify({'success': False, 'error': 'Category required'}), 400
        
        # Update yesterday's streak status
        yesterday_streaks = user_data.get('yesterdayStreaks', {})
        yesterday_streaks[category] = completed
        user_data['yesterdayStreaks'] = yesterday_streaks
        
        # Update actual streak
        if completed:
            user_data['streaks'][category] = user_data['streaks'].get(category, 0) + 1
        else:
            # Failed - reset streak and lose a heart
            user_data['streaks'][category] = 0
            user_data['hearts'] = max(0, user_data.get('hearts', 3) - 1)
        
        save_user_data(user_data)
        
        return jsonify({
            'success': True,
            'data': user_data
        })
    
    except Exception as e:
        print(f"Error completing yesterday: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print(f"Starting FocusPoint Tracker")
    print(f"Data will be saved to: {os.path.abspath(DATA_FILE)}")
    app.run(debug=True)