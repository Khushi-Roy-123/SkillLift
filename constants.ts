
import { MenuItem } from './types';
import { HomeIcon, ChatIcon, BriefcaseIcon, LightbulbIcon, GamepadIcon, DocumentIcon, ForumIcon, SettingsIcon, HeartbeatIcon, CoffeeIcon } from './components/icons';

export const MENU_ITEMS: MenuItem[] = [
  { name: 'Home', icon: HomeIcon },
  { name: 'Ask SkillLift', icon: ChatIcon },
  { name: 'Community Forum', icon: ForumIcon },
  { name: 'Opportunities', icon: BriefcaseIcon },
  { name: 'Inspiration Hub', icon: LightbulbIcon },
  { name: 'SkillQuest', icon: GamepadIcon },
  { name: 'Wellbeing Hub', icon: HeartbeatIcon },
  { name: 'Life Balance', icon: CoffeeIcon },
  { name: 'Resume Tips', icon: DocumentIcon },
  { name: 'Settings', icon: SettingsIcon },
];
