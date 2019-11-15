# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Drawing.destroy_all

user = User.create(name: 'swag boi')

drawing = Drawing.create(name: 'cat', data: 'https://pixel.nymag.com/imgs/daily/vulture/2019/04/04/04-lil-nas-x.w700.h700.jpg', user_id: user.id, xaverage: 400, yaverage: 300)

