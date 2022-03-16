export interface Project {
  id: number;
  title: string;
  iconName?: string;
  imageName?: string;
  color?: string;
  position?: number;
}

export interface ProjectCreateParams {
  title: string;
  iconName?: string;
  imageName?: string;
}

export interface ProjectUpdateParams {
  id: number;
  title?: string;
  iconName?: string;
  imageName?: string;
  color?: string;
  position?: number;
}

export interface ProjectReorderParams {
  fromPosition?: number;
  toPosition?: number;
}
