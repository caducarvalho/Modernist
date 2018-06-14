# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Theme.create(color: '#E4523B', code: 14963259, name: 'Red')
Theme.create(color: '#0A454D', code: 673101, name: 'Navy')
Theme.create(color: '#3DB296', code: 4043414, name: 'Blue')
Theme.create(color: '#ECC417', code: 15516695, name: 'Yellow')
Theme.create(color: '#E8931E', code: 15242014, name: 'Orange')

Icon.create(name: 'briefcase')
Icon.create(name: 'utensils')
Icon.create(name: 'plane')
Icon.create(name: 'bed')
Icon.create(name: 'shopping-cart')
Icon.create(name: 'football-ball')
Icon.create(name: 'film')
Icon.create(name: 'gamepad')
Icon.create(name: 'book')
Icon.create(name: 'heart')
Icon.create(name: 'notes-medical')
