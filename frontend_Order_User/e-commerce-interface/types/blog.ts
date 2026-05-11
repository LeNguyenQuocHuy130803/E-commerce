export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  avatar: string;
  author: string;
  category: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPaginatedResponse {
  data: BlogPost[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
