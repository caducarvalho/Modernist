class SessionsController < ApplicationController
  def new
    render layout: 'user'
  end

  def create
    @user = User.find_by_email(params[:email])

    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id
      redirect_to root_path
    else
      flash[:alert] = "The user #{params[:email]} doesn't exist or the password is incorrect"
      redirect_to '/login'
    end

  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end
end
