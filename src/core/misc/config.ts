interface Config {
  IS_DEV: boolean;
}

export const config: Config = {
  IS_DEV: import.meta.env.DEV,
};
