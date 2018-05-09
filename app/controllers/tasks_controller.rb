class TasksController < ApplicationController
  before_action :find_task, only: [:show, :edit, :update, :destroy]
  before_action :require_user

  def index
    @tasks = Task.where(user_id: current_user.id)
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)

    if @task.save
      redirect_to root_path, notice: "The task was created!"
    else
      redirect_to '/'
    end
  end

  def show
  end

  def edit
  end

  def update
    @task.completed_at = @task.completed_at.nil? ? Time.now : nil

    if @task.update(task_params)
      redirect_to @task, notice: "The task was created!"
    else
      redirect_to @task
    end
  end

  def destroy
    @task.destroy
    redirect_to root_path, notice: "Task destroyed"
  end

  private

  def task_params
    params.require(:task).permit(:task, :completed_at, :user_id)
  end

  def find_task
    @task = Task.find(params[:id])
  end
end
