class CategoriesController < ApplicationController
  before_action :find_category, only: [:show, :edit, :update, :destroy]
  before_action :list_categories, only: [:show, :edit]
  before_action :back_button, only: [:show, :edit]
  before_action :require_user

  def show
    @icons = Icon.all
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      redirect_to root_path, notice: "The category was created!"
    else
      redirect_to root_path, alert: "The category could't be created!"
    end
  end

  def edit
  end

  def update
    if @category.update(category_params)
      redirect_to @category, notice: "The category was updated!"
    else
      redirect_to @category, alert: "The category could't be updated!"
    end
  end

  def destroy
    if params[:delete_posts] == '1'
      @category.tasks.each { |t| t.update_attributes!(category_id: params[:new_category_id]) }
      @category.reload.destroy
      redirect_to root_path, notice: "The category was deleted, and its tasks were moved"
    elsif params[:delete_posts] == '0'
      @category.destroy
      redirect_to root_path, notice: 'The category and its tasks were deleted'
    else
      if @category.tasks.count < 1
        @category.destroy
        redirect_to root_path, notice: 'The category was deleted'
      else
        redirect_to category_path(@category), alert: 'There was something wrong'
      end
    end
  end

  private

  def category_params
    params.require(:category).permit(:name, :user_id, :details)
  end

  def list_categories
    @categories = Category.owned_by_user(current_user.id)
    @other_categories = Category.other_categories(current_user.id, @category.id)
  end

  def find_category
    @category = Category.find(params[:id])

    redirect_to root_path unless @category.user_id == current_user.id
  end

  def back_button
    @back_button = true
  end
end
