const { faker } = require('@faker-js/faker')

const fakeData = [
  {
    id: faker.string.uuid(),
    name: 'Сделать прототип API для сервиса управления заявками на помощь',
    description: 'нужно будет в дальнейшем прикрутить frontend',
    createdAt: faker.date.anytime('DD.MM.YYYY').toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }),
    status: false,
  },
  {
    id: faker.string.uuid(),
    name: faker.hacker.phrase(10),
    description: faker.hacker.phrase(50),
    createdAt: faker.date.anytime('DD.MM.YYYY').toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }),
    status: true,
  },
  {
    id: faker.string.uuid(),
    name: faker.hacker.phrase(5),
    description: faker.hacker.phrase(30),
    createdAt: faker.date.anytime('DD.MM.YYYY').toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }),
    status: false,
  },
]

module.exports = fakeData
