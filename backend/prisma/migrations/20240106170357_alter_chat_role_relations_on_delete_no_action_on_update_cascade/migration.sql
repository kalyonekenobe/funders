-- DropForeignKey
ALTER TABLE "ChatsOnUsers" DROP CONSTRAINT "ChatsOnUsers_role_fkey";

-- AddForeignKey
ALTER TABLE "ChatsOnUsers" ADD CONSTRAINT "ChatsOnUsers_role_fkey" FOREIGN KEY ("role") REFERENCES "ChatRole"("name") ON DELETE NO ACTION ON UPDATE CASCADE;
