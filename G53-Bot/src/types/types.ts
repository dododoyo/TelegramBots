import { Scenes, Context } from "telegraf";
export interface MySession extends Scenes.SceneSession {
  allNews: any;
  user_location: any;
  current_index: number;
}

export interface MyContext extends Context {
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext>;
}
