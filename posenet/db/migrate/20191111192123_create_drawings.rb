class CreateDrawings < ActiveRecord::Migration[6.0]
  def change
    create_table :drawings do |t|
      t.string :name
      t.text :data
      t.integer :user_id
      t.float :xaverage
      t.float :yaverage

      t.timestamps
    end
  end
end
