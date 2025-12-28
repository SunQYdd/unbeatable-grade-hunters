package com.taogexuefen.aethernet_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.dto.PostCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostQueryDTO;
import com.taogexuefen.aethernet_backend.model.dto.PostUpdateRequest;
import com.taogexuefen.aethernet_backend.model.vo.FavoriteVO;
import com.taogexuefen.aethernet_backend.model.vo.PostDetailVO;
import com.taogexuefen.aethernet_backend.model.vo.PostGeneratedVO;
import com.taogexuefen.aethernet_backend.model.vo.PostVO;

public interface PostService {
    /**
     * 发布帖子
     * @param request 帖子创建请求
     * @param userId 用户ID
     * @return 帖子ID
     */
    Long createPost(PostCreateRequest request, Long userId);

    /**
     * 编辑帖子
     * @param postId 帖子ID
     * @param request 帖子更新请求
     * @param userId 用户ID
     * @return 帖子ID
     */
    Long updatePost(Long postId, PostUpdateRequest request, Long userId);

    /**
     * 获取帖子列表
     * @param queryDTO 查询参数
     * @return 分页帖子列表
     */
    Page<PostVO> getPostList(PostQueryDTO queryDTO, Long userId);

    /**
     * 获取帖子详情
     * @param postId 帖子ID
     * @param userId 当前用户ID
     * @return 帖子详情
     */
    PostDetailVO getPostDetail(Long postId, Long userId);

    /**
     * 删除帖子
     * @param postId 帖子ID
     * @param userId 用户ID
     * @return 是否删除成功
     */
    boolean deletePost(Long postId, Long userId);

    /**
     * 点赞/取消点赞帖子
     * @param postId 帖子ID
     * @param userId 用户ID
     * @return 点赞状态和点赞数
     */
    LikeResult likePost(Long postId, Long userId);

    /**
     * 收藏/取消收藏帖子
     * @param postId 帖子ID
     * @param userId 用户ID
     * @return 收藏状态
     */
    FavoriteResult favoritePost(Long postId, Long userId);

    /**
     * 获取当前用户的收藏列表
     * @param page 页码
     * @param size 每页条数
     * @param userId 用户ID
     * @return 收藏帖子分页列表
     */
    Page<FavoriteVO> getFavorites(Integer page, Integer size, Long userId);



    /**
     * 置顶/取消置顶帖子
     * @param postId 帖子ID
     * @param isTop 是否置顶，1表示置顶，0表示取消置顶
     * @return 是否操作成功
     */
    boolean toggleTopPost(Long postId, Integer isTop);

    /**
     * 设置/取消精华帖
     * @param postId 帖子ID
     * @param isFeatured 是否设为精华帖，1表示设为精华帖，0表示取消精华帖
     * @return 是否操作成功
     */
    boolean toggleFeaturedPost(Long postId, Integer isFeatured);

    PostGeneratedVO generatePost(String prompt);

    /**
     * 点赞结果类
     */
    class LikeResult {
        private Boolean isLiked;
        private Integer likeCount;

        public LikeResult(Boolean isLiked, Integer likeCount) {
            this.isLiked = isLiked;
            this.likeCount = likeCount;
        }

        public Boolean getIsLiked() {
            return isLiked;
        }

        public void setIsLiked(Boolean isLiked) {
            this.isLiked = isLiked;
        }

        public Integer getLikeCount() {
            return likeCount;
        }

        public void setLikeCount(Integer likeCount) {
            this.likeCount = likeCount;
        }
    }

    /**
     * 收藏结果类
     */
    class FavoriteResult {
        private Boolean isFavorited;

        public FavoriteResult(Boolean isFavorited) {
            this.isFavorited = isFavorited;
        }

        public Boolean getIsFavorited() {
            return isFavorited;
        }

        public void setIsFavorited(Boolean isFavorited) {
            this.isFavorited = isFavorited;
        }
    }
}
