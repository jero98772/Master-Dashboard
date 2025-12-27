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
    'hearts': 1,
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

if __name__ == '__main__':
    print(f"Starting FocusPoint Tracker")
    print(f"Data will be saved to: {os.path.abspath(DATA_FILE)}")
    app.run(debug=True)