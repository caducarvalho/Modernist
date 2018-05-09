Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'tasks#index'

  resources :tasks
  post 'create' => 'tasks#create'

  resources :users
  get 'signup' => 'users#new'

  resources :sessions
  get 'login' => 'sessions#new'
  post 'login' => 'sessions#create'
  get 'logout' => 'sessions#destroy'
end
