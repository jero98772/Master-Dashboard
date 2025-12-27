from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__)

# In-memory data structure (you can replace this with a database)
user_data = {
    'fp': 0,
    'minutes': 0,
    'hearts': 1,
    'privacy': False,
    'streaks': {
        'porn': 1,
        'routine': 2,
        'code': 0
    },
    'combo': 0,
    'multiplier': 1.0,
    'quickWins': [False, False, False, False],
    'timeData': {
        'coding': {'minutes': 0, 'percentage': 0},
        'learning': {'minutes': 0, 'percentage': 0},
        'exercise': {'minutes': 0, 'percentage': 0},
        'other': {'minutes': 0, 'percentage': 0}
    },
    'last_updated': datetime.now().isoformat()
}

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
    data = request.json
    user_data.update(data)
    user_data['last_updated'] = datetime.now().isoformat()
    return jsonify({'success': True, 'data': user_data})

@app.route('/api/save-progress', methods=['POST'])
def save_progress():
    """Save user progress (FP, streaks, etc.)"""
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
    
    user_data['last_updated'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'message': 'Progress saved successfully',
        'data': user_data
    })

@app.route('/api/add-fp', methods=['POST'])
def add_fp():
    """Add FP to user account"""
    data = request.json
    amount = data.get('amount', 0)
    source = data.get('source', 'unknown')
    
    user_data['fp'] += amount
    user_data['last_updated'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'message': f'Added {amount} FP from {source}',
        'data': user_data
    })

@app.route('/api/purchase', methods=['POST'])
def purchase_item():
    """Handle FP store purchases"""
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
    
    user_data['last_updated'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'message': f'Purchased {item_type}',
        'data': user_data
    })

@app.route('/api/increment-streak', methods=['POST'])
def increment_streak():
    """Increment a streak counter"""
    data = request.json
    streak_type = data.get('type')  # 'porn', 'routine', or 'code'
    
    if streak_type in user_data['streaks']:
        user_data['streaks'][streak_type] += 1
        user_data['last_updated'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'data': user_data
    })

@app.route('/api/quick-win', methods=['POST'])
def complete_quick_win():
    """Complete a quick win task"""
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
        
        user_data['last_updated'] = datetime.now().isoformat()
        
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
    data = request.json
    
    user_data['combo'] = data.get('combo', 0)
    user_data['multiplier'] = data.get('multiplier', 1.0)
    user_data['last_updated'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'data': user_data
    })

@app.route('/api/reset-quick-wins', methods=['POST'])
def reset_quick_wins():
    """Reset quick wins (call daily)"""
    user_data['quickWins'] = [False, False, False, False]
    user_data['last_updated'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'message': 'Quick wins reset',
        'data': user_data
    })

if __name__ == '__main__':
    app.run(debug=True)