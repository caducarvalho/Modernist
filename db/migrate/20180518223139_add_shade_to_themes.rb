class AddShadeToThemes < ActiveRecord::Migration[5.2]
  def change
    add_column :themes, :variation, :string
  end
end
