class Category < ApplicationRecord
  validates :name, presence: true, length: { maximum: 30 }
  validates :details, length: { maximum: 280 }

  has_many :tasks, dependent: :destroy
  belongs_to :user

  scope :owned_by_user, -> (user) { where("user_id = ?", user) }
  scope :other_categories, -> (user, category) { where("user_id = ?", user).where.not("id = ?", category) }
end
