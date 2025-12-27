from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__)

# Sample data structure (you can connect this to a database)
user_data = {
    'streaks': {
        'porn': 0,
        'routine': 0,
        'code': 0
    },
    'fp': 0,
    'hearts': 1,
    'last_updated': datetime.now().isoformat()
}

@app.route('/')
def index():
    """Render the main productivity tracker page"""
    # Optionally pass initial data to the template
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
    if 'streaks' in data:
        user_data['streaks'].update(data['streaks'])
    if 'hearts' in data:
        user_data['hearts'] = data['hearts']
    
    user_data['last_updated'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'message': 'Progress saved successfully',
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
        
    return jsonify({
        'success': True,
        'data': user_data
    })

if __name__ == '__main__':
    app.run(debug=True)