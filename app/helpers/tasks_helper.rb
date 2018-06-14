module TasksHelper
  def format_task_name(task, category = nil)
    string = ''
    string += icon('fa', 'exclamation-circle', class: 'task-overdue') if is_overdue(task)
    string += icon('fa', 'bell', class: 'task-today') if is_today(task)
    string += icon('fa', task.icon.name, class: 'task-icon fa-fw') if task.icon_id != nil
    string += task.task
    string += content_tag(:span, " in #{category} / #{days_overdue(task)} days ago", class: 'task-category-name') if category
    string.html_safe
  end

  def is_overdue(task)
    if task.due_date != '' && task.due_date != nil && !task.completed
      task.due_date.past? && !task.due_date.today?
    end
  end

  def is_today(task)
    if task.due_date != '' && task.due_date != nil && !task.completed
      task.due_date.today?
    end
  end

  def days_overdue(task)
    (Time.now - task.due_date).round / (24 * 60 * 60)
  end
end
