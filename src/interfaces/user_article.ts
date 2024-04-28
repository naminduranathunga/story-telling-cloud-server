

export interface SimpleArticle {
    _id: string,
    user_id: string,
    title: string,
    thumbnail: string,
    tags: string,
    likes: number,
    comments_count: number,
    share_count: number,
}



export interface ArticleImage {
    _id: string,
    path: string,
    url: string,
}

export interface FullArticle extends SimpleArticle {
    content: string,
    content_plain: string,
    audio_version: string,
    images: Array<ArticleImage>,
}

