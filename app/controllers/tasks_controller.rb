class TasksController < ApplicationController
  before_action :require_user
  before_action :find_task, only: [:show, :edit, :update, :destroy, :check_complete, :check_task_complete, :pomodoro]
  before_action :back_button, only: [:show, :edit, :overdue, :due_today]
  before_action :list_categories, only: [:index, :edit, :update]

  def index
    @task_count = Task.owned_by_user(current_user.id).count
    @overdue_count = Task.overdue(current_user.id).count
    @overdue_tasks = Task.overdue_five(current_user.id)
    @today_count = Task.due_today(current_user.id).count
    @today_tasks = Task.due_today_five(current_user.id)
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)

    if @task.save
      flash[:notice] = "The task was created!"
      redirect_back(fallback_location: root_path)
    else
      redirect_to '/'
    end
  end

  def show
  end

  def edit
  end

  def update
    if @task.update(task_params)
      redirect_to root_path, notice: "The task was updated!"
    else
      redirect_to @task
    end
  end

  def destroy
    @task.destroy
    redirect_to root_path, notice: "Task destroyed"
  end

  def check_complete
    @task.completed = @task.completed? ? false : true

    if @task.update(task_check)
      flash[:notice] = @task.completed? ? "The task was checked complete!" : "The task was unchecked!"
      redirect_to root_path
    else
      redirect_to edit_task_path(@task)
    end
  end

  def check_task_complete
    @task.completed = @task.completed? ? false : true

    respond_to do |format|
      if @task.update(task_check)
        hash = { completed: @task.completed, due_date: @task.due_date, category_id: @task.category_id }
        format.json { render json: hash }
      else
        format.json { render json: false }
      end
    end
  end

  def overdue
    @overdue_tasks = Task.overdue(current_user.id)
  end

  def retrieve_overdue_tasks
    @overdue_tasks_count = Task.overdue(current_user.id).count
    @overdue_tasks = Task.overdue_five(current_user.id)

    respond_to do |format|
      hash = { count: @overdue_tasks_count, tasks: @overdue_tasks }
      format.json { render json: hash }
    end
  end

  def due_today
    @today_tasks = Task.due_today(current_user.id)
  end

  def retrieve_today_tasks
    @today_tasks_count = Task.due_today(current_user.id).count
    @today_tasks = Task.due_today_five(current_user.id)

    respond_to do |format|
      hash = { count: @today_tasks_count, tasks: @today_tasks }
      format.json { render json: hash }
    end
  end

  def pomodoro
    if @task.completed == false
      render layout: 'pomodoro'
    else
      redirect_to root_path
    end
  end

  private

  def task_params
    params.require(:task).permit(:task, :completed, :due_date, :user_id, :details, :category_id, :icon_id)
  end

  def task_check
    params.permit(:completed)
  end

  def find_task
    @task = Task.find(params[:id])
  end

  def list_categories
    @categories = Category.owned_by_user(current_user.id).includes(:tasks)
    @categories_count = @categories.count
    @icons = Icon.all
  end

  def back_button
    @back_button = true
  end
end
