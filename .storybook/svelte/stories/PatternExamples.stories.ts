import type { Meta, StoryObj } from "@storybook/svelte-vite";
import PatternPreview from "./PatternPreview.svelte";

const meta = {
  title: "Svelte/Patterns",
  component: PatternPreview,
  parameters: { layout: "padded" },
} satisfies Meta<PatternPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
const story = (patternId: string): Story => ({ args: { patternId } });
export const Visit = story("visit");
export const Search = story("search");
export const Login = story("login");
export const Application = story("application");
export const Policy = story("policy");
export const PersonalInformation = story("personal-information");
export const Help = story("help");
export const Consent = story("consent");
export const List = story("list");
export const Feedback = story("feedback");
export const Detail = story("detail");
export const Error = story("error");
export const Form = story("form");
export const Attachment = story("attachment");
export const FilterSort = story("filter-sort");
export const Confirm = story("confirm");
export const MobileNotification = story("mobile-notification");
export const MobileSettings = story("mobile-settings");
