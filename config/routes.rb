Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'tasks#index'

  resources :tasks
  patch 'tasks/check_complete/:id' => 'tasks#check_complete', as: 'complete_task'
  get 'overdue' => 'tasks#overdue', as: 'overdue_tasks'
  get 'today' => 'tasks#due_today', as: 'today_tasks'
  get 'check_task_complete/:id' => 'tasks#check_task_complete', as: 'check_task_complete'
  get 'retrieve_overdue_tasks' => 'tasks#retrieve_overdue_tasks', as: 'retrieve_overdue_tasks'
  get 'retrieve_today_tasks' => 'tasks#retrieve_today_tasks', as: 'retrieve_today_tasks'
  get 'pomodoro/:id' => 'tasks#pomodoro', as: 'pomodoro'

  resources :users
  get 'signup' => 'users#new'
  get 'edit_password' => 'users#edit_password', as: 'edit_password'
  patch 'update_password' => 'users#update_password', as: 'update_password'
  get 'remove' => 'users#remove', as: 'remove_user'

  resources :sessions
  get 'login' => 'sessions#new'
  post 'login' => 'sessions#create'
  get 'logout' => 'sessions#destroy'

  resources :categories
end
