class RenameCompletedAtInTasks < ActiveRecord::Migration[5.2]
  def change
    rename_column :tasks, :completed_at, :due_date
  end
end
