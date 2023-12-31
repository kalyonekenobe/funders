const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const users = await prisma.user.findMany({ select: { id: true } });

    const data = [
      {
        authorId: users[0].id,
        title: 'Fundraising for the needs of the 95th Brigade of the Armed Forces of Ukraine',
        content: `Title: Supporting Ukraine's 95th Brigade: 
                  Fundraising Essentials Introduction: 
                  Briefly introduce the 95th Brigade's role in Ukraine's defense. 
                  Highlight the urgent need for support to aid these soldiers. 
                  Challenges Faced: 
                  Outline the specific challenges the brigade encounters. 
                  Emphasize the immediate requirements for resources and aid. 
                  Impact of Fundraising: 
                  Stress the crucial role of donations in meeting the brigade's urgent needs. 
                  Explain how contributions directly benefit the soldiers. 
                  Current Initiatives: 
                  Share ongoing fundraising efforts targeting support for the 95th Brigade. 
                  Provide actionable ways for readers to contribute. 
                  Transparency and Trust: 
                  Ensure donations reach the brigade through trustworthy channels. 
                  Emphasize transparency in the fundraising process. 
                  Conclusion: 
                  Reiterate the importance of support for the 95th Brigade. 
                  Encourage readers to participate in aiding these brave soldiers.`,
        fundsToBeRaised: 1000000,
      },
      {
        authorId: users[0].id,
        title: 'Fundraising for a tank for the 12th Brigade of the Azov National Guard of Ukraine',
        content: `Title: Supporting Ukraine's 12th Brigade: 
                  Fundraising for a Tank Ukraine's 12th Brigade of the Azov National Guard requires a critical asset — a tank. 
                  This fundraising effort aims to provide essential armored support to bolster their defense. 
                  Your contribution directly enhances the brigade's defensive capabilities, aiding them in protecting the nation's sovereignty. 
                  Join us in empowering these courageous soldiers with the resources they urgently need. 
                  Stand united with Ukraine's 12th Brigade. 
                  Contribute today to support their vital mission in safeguarding the country. 
                  Every donation makes a difference in fortifying their defense.`,
        fundsToBeRaised: 1085655.5,
        isDraft: true,
      },
      {
        authorId: users[1].id,
        title: 'Fundraising for children and homeless people',
        content: `Title: Giving Hope: 
                  Fundraising for Children & the Homeless Fundraising for children and the homeless is a lifeline of hope. 
                  Your support provides essentials like education, healthcare, and shelter, shaping brighter futures. 
                  Join the cause, be a beacon of compassion. 
                  Even a small donation makes a big difference. 
                  Together, let's uplift lives and bring hope to those in need.`,
        fundsToBeRaised: 15250,
      },
      {
        authorId: users[3].id,
        title: 'Raising funds for animals in the shelter',
        content: `Title: Supporting Shelter Animals: 
                  Fundraising for Their Care Animals in shelters await our support and care. 
                  Raising funds for these furry friends means providing food, shelter, and medical aid they desperately need. 
                  Your contribution directly impacts their well-being. 
                  Even a small donation helps offer comfort and a chance for a loving home. 
                  Let's stand together for these voiceless beings. 
                  Join the cause to ensure they receive the care they deserve. 
                  Your kindness matters in making a difference in their lives.`,
        fundsToBeRaised: 7300,
      },
      {
        authorId: users[4].id,
        title: 'Raising funds for young talents',
        content: `Title: Empowering Young Talents: 
                  Fundraising for Aspiring Minds Supporting young talents is an investment in the future. 
                  Raising funds for budding artists, scholars, and innovators paves the way for their dreams to flourish. 
                  Your contribution fuels their aspirations. 
                  Every donation nurtures their potential, enabling them to pursue their passions and make a positive impact. 
                  Join the movement to empower these promising minds. 
                  Your support fosters creativity, education, and innovation, shaping a brighter tomorrow for our world.`,
        fundsToBeRaised: 20000,
        isDraft: true,
      },
    ];

    await prisma.post.createMany({ data });
  },

  async down() {
    await prisma.post.deleteMany();
  },
};
