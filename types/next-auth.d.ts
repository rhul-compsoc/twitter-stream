import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Discord provider gives extra discord specific stuff
   */
  interface Profile {
    id : number,
    username: string,
    discriminator: string,
    display_name: string,
    avatar: string,
    banner_color: string,
    accent_color: number,
    locale: string,
    mfa_enabled: boolean,
    global_name: string,
  }
}