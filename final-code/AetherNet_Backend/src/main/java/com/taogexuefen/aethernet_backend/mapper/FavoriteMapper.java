package com.taogexuefen.aethernet_backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.taogexuefen.aethernet_backend.model.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FavoriteMapper extends BaseMapper<Favorite> {
}