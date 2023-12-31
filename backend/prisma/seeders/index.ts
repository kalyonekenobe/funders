const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const defaultSeederPattern = `const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    
  },

  async down() {
    
  },
};
`;

const main = async () => {
  const commandLineArguments = process.argv.slice(2);

  if (
    commandLineArguments.includes('--up') &&
    commandLineArguments.includes('--down') &&
    commandLineArguments.includes('--create')
  ) {
    console.error(
      'Cannot run seeders because of ambiguous parameters --up, --down or --create. Only one of them should be chosen.',
    );
    return;
  }

  if (commandLineArguments.includes('--create')) {
    const index = commandLineArguments.indexOf('--create');
    if (index == commandLineArguments.length - 1) {
      console.error('Cannot create new seeder file. No seeder name was specified.');
      return;
    }

    if (index <= commandLineArguments.length - 3) {
      console.error(
        'Cannot create new seeder file. Too much parameters for --create option were specified.',
      );
      return;
    }

    const now = new Date();
    const filename = `${now.getTime()}${now.getMilliseconds().toString().padStart(3, '0')}-${
      commandLineArguments[index + 1]
    }.seeder.js`;

    fs.writeFile(`backend/prisma/seeders/${filename}`, defaultSeederPattern, err => {
      if (err) {
        console.error(`An error occured on creating ${filename} file.`);
      } else {
        console.log(`${filename} was successfully created`);
      }
    });

    return;
  }

  await showTablesData();

  const revert = commandLineArguments.includes('--down');
  const files = await fs.promises.readdir(__dirname);

  let seeders = files?.filter(file => file.match(/[\w\d]+((\-|\.)[\w\d])*\.seeder\.js/i)) ?? [];

  if (revert) seeders = seeders.reverse();

  for (const file of seeders) {
    const { up, down } = (await import(`./${file}`)).default;

    if ((revert && !down) || (!revert && !up)) {
      console.error(
        `Cannot run seeders because for ${file}, ${
          revert ? '"down"' : '"up"'
        } function does not exist.`,
      );
    } else {
      revert ? await down() : await up();
    }
  }
};

const showTablesData = async () => {
  const prisma = new PrismaClient();

  console.log(await prisma.userRegistrationMethod.findMany());
  console.log(await prisma.userRole.findMany());
  console.log(await prisma.user.findMany());
  console.log(await prisma.usersBanListRecordStatus.findMany());
  console.log(await prisma.usersBanListRecord.findMany());
  console.log(await prisma.userReactionType.findMany());
  console.log(await prisma.chatRole.findMany());
  console.log(await prisma.chat.findMany());
  console.log(await prisma.chatMessage.findMany());
  console.log(await prisma.chatMessageAttachment.findMany());
  console.log(await prisma.chatsOnUsers.findMany());
  console.log(await prisma.following.findMany());
  console.log(await prisma.postCategory.findMany());
  console.log(await prisma.post.findMany());
  console.log(await prisma.categoriesOnPosts.findMany());
  console.log(await prisma.postDonation.findMany());
  console.log(await prisma.postReaction.findMany());
  console.log(await prisma.postComment.findMany());
  console.log(await prisma.postCommentAttachment.findMany());
  console.log(await prisma.postCommentReaction.findMany());
};

main();
