class User < ApplicationRecord
  has_secure_password

  validates :email,
      uniqueness: { message: 'This e-mail is already being used' },
      format: { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, message: 'This doesn\'t look like an e-mail address' }

  validates :password, :format => { :with => /\A(?=.*[a-zA-Z])(?=.*[0-9]).{8,}\Z/i, message: 'Password must have at least 8 characters and include one number, one lowercase letter and one uppercase letter.' }, on: :create

  has_many :tasks, dependent: :destroy
  has_many :categories, dependent: :destroy

  def full_name
    "#{self.first_name} #{self.last_name}"
  end
end
