class UsersController < ApplicationController
  before_action :require_user, only: [:edit, :edit_password, :update_password, :update]
  before_action :find_user, only: [:edit, :edit_password, :update_password, :update, :remove, :destroy]

  def new
    @user = User.new

    render layout: 'user'
  end

  def create
    @user = User.new(user_params)

    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path
    else
      redirect_to '/signup'
    end
  end

  def edit
  end

  def edit_password
  end

  def update
    user = User.find_by_email(current_user.email).try(:authenticate, params[:current_password])

    if user && @user.update_attributes(user_simple_params)
      redirect_to root_path, notice: 'The user information was updated successfully!'
    else
      redirect_to edit_user_path(@user.id), alert: 'The user information couldn\'t be updated!'
    end
  end

  def update_password
    user = User.find_by_email(current_user.email).try(:authenticate, params[:current_password])

    if user && @user.update_attributes(password_params)
      redirect_to root_path, notice: 'The user password was updated successfully!'
    else
      redirect_to edit_password_path, alert: 'The user password couldn\'t be updated!'
    end
  end

  def remove
  end

  def destroy
    user = User.find_by_email(current_user.email).try(:authenticate, params[:current_password])

    if user && params[:remove_confirmation]
      session[:user_id] = nil
      @user.destroy
      redirect_to login_url, notice: 'We\'re sad to see you go. All your tasks and other data were successfully deleted'
    else
      redirect_to remove_user_path, alert: 'There was something wrong, and we could\'t delete your account'
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end

  def user_simple_params
    params.require(:user).permit(:first_name, :last_name, :email)
  end

  def password_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  def find_user
    @user = User.find(current_user.id)
  end
end
