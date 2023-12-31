const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const Permissions = {
      CREATE_COMMENTS: 1,
      CREATE_CHATS: 2,
      UPGRADE_USER_ROLE: 4,
      CREATE_POSTS: 8,
      BAN_USERS: 16,
      CREATE_NEW_USERS: 32,
      REMOVE_OR_HIDE_OTHER_USERS_POSTS: 64,
      REMOVE_OTHER_USERS_COMMENTS: 128,
    };

    const defaultUserPermissions =
      Permissions.CREATE_COMMENTS | Permissions.CREATE_CHATS | Permissions.UPGRADE_USER_ROLE;
    const volunteerPermissions = defaultUserPermissions | Permissions.CREATE_POSTS;
    const administratorPermissions =
      volunteerPermissions |
      Permissions.BAN_USERS |
      Permissions.CREATE_NEW_USERS |
      Permissions.REMOVE_OR_HIDE_OTHER_USERS_POSTS |
      Permissions.REMOVE_OTHER_USERS_COMMENTS;

    const data = [
      { name: 'Default', permissions: defaultUserPermissions },
      { name: 'Volunteer', permissions: volunteerPermissions },
      { name: 'Administrator', permissions: administratorPermissions },
    ];

    await prisma.userRole.createMany({ data });
  },

  async down() {
    await prisma.userRole.deleteMany();
  },
};
