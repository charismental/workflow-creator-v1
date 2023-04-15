import type { MenuProps, MenuTheme } from "antd/es/menu";

type MenuItem = Required<MenuProps>["items"][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
) => ({ key, icon, children, label, type });

export default getItem;
