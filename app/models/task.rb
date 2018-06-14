class Task < ApplicationRecord
  validates :task, presence: true

  belongs_to :user
  belongs_to :category
  belongs_to :icon, optional: true

  scope :owned_by_user, -> (user) { where("user_id = ?", user) }
  scope :to_do, -> (user, category) { where("user_id = ? AND category_id = ? AND completed = 0", user, category) }
  scope :overdue, -> (user) { where("user_id = ? AND due_date < ? AND completed = ?", user, Date.today, 0).order(:due_date) }
  scope :overdue_five, -> (user) { where("user_id = ? AND due_date < ? AND completed = ?", user, Date.today, 0).order(:due_date).limit(5) }
  scope :due_today, -> (user) { where("user_id = ? AND due_date = ? AND completed = ?", user, Date.today, 0) }
  scope :due_today_five, -> (user) { where("user_id = ? AND due_date = ? AND completed = ?", user, Date.today, 0).limit(5) }
end
