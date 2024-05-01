const { prisma } = require('../utils/prisma.utils');
const { PasswordService } = require('../utils/password.service');
const { Stripe } = require('stripe');

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2024-04-10',
});

const passwordService = new PasswordService(
  process.env.USER_PASSWORD_SALT_PREFIX ?? '',
  process.env.USER_PASSWORD_SALT_SUFFIX ?? '',
);

module.exports = {
  async up() {
    const data = [
      {
        registrationMethod: 'Default',
        role: 'Administrator',
        firstName: 'Alex',
        lastName: 'Igumnov',
        birthDate: new Date('2004-09-03'),
        email: 'alexigumnov@gmail.com',
        password: await passwordService.hash('#Password123'),
      },
      {
        registrationMethod: 'Google',
        role: 'Default',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('1996-07-04'),
        email: 'johndoe@gmail.com',
        password: await passwordService.hash('.123456Secret'),
      },
      {
        registrationMethod: 'Discord',
        role: 'Volunteer',
        firstName: 'Samantha',
        lastName: 'Jones',
        birthDate: new Date('1999-03-17'),
        email: 'samanthajones@gmail.com',
        password: await passwordService.hash('Ofk@j14mf50t'),
      },
      {
        registrationMethod: 'Google',
        role: 'Volunteer',
        firstName: 'Vova',
        lastName: 'Havryliuk',
        birthDate: new Date('2003-12-21'),
        email: 'vovahavryliuk@gmail.com',
        password: await passwordService.hash('lbmr-6rfm34fr!XX'),
      },
      {
        registrationMethod: 'Default',
        role: 'Default',
        firstName: 'Helen',
        lastName: 'Effenberg',
        birthDate: new Date('2004-01-30'),
        email: 'heleneffenberg@gmail.com',
        password: await passwordService.hash('3fk5mhl70qrazaA$'),
      },
    ];

    const response = await Promise.all(
      data.map(item =>
        stripe.customers
          .create({
            name: `${item.firstName} ${item.lastName}`,
            email: item.email,
          })
          .then(response => ({ data: item, stripeCustomerId: response.id })),
      ),
    );
    await prisma.user.createMany({
      data: response.map(item => ({ ...item.data, stripeCustomerId: item.stripeCustomerId })),
    });
  },

  async down() {
    const users = await prisma.user.findMany();
    users.forEach(user => {
      try {
        stripe.customers.del(user.stripeCustomerId);
      } catch (error) {
        console.log(error);
      }
    });
    await prisma.user.deleteMany();
  },
};
