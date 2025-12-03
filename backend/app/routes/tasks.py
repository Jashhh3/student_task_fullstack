from flask import Blueprint, request, jsonify
from app import db
from app.models import Task
from app.utils.auth import token_required
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return jsonify([task.to_dict() for task in tasks]), 200

@tasks_bp.route('', methods=['POST'])
@token_required
def create_task(current_user):
    data = request.get_json()
    title = data.get('title')
    
    if not title:
        return jsonify({'message': 'Title is required'}), 400

    description = data.get('description')
    due_date_str = data.get('due_date')
    due_date = None
    if due_date_str:
        try:
            due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
        except ValueError:
            pass # Handle invalid date format if needed

    new_task = Task(
        title=title,
        description=description,
        due_date=due_date,
        user_id=current_user.id
    )
    
    db.session.add(new_task)
    db.session.commit()

    return jsonify(new_task.to_dict()), 201

@tasks_bp.route('/<int:id>/toggle', methods=['PATCH'])
@token_required
def toggle_task(current_user, id):
    task = Task.query.filter_by(id=id, user_id=current_user.id).first()
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    task.status = 'completed' if task.status == 'pending' else 'pending'
    db.session.commit()
    
    return jsonify(task.to_dict()), 200

@tasks_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_task(current_user, id):
    task = Task.query.filter_by(id=id, user_id=current_user.id).first()
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': 'Task deleted'}), 200
