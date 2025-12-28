package com.taogexuefen.aethernet_backend.controller.pub;

import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.utils.AliOssUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/oss")
@Tag(name = "oss服务接口")
@Slf4j
public class OssController {

    @Autowired
    private AliOssUtil aliOssUtil;

    // 文件上传
    @PostMapping("/upload")
    @Operation(summary = "文件上传")
    public Result<String> upload(MultipartFile file) {
        log.info("文件上传：{}", file);
        try {
            String originalFilename = file.getOriginalFilename(); // 原始文件名

            // 处理文件扩展名
            String extension = ".jpg"; // 默认扩展名
            if (StringUtils.isNotEmpty(originalFilename) && originalFilename.lastIndexOf(".") > 0) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // 构造新文件名称
            String objectName = UUID.randomUUID().toString() + extension;
            // 文件的请求路径
            String filePath = aliOssUtil.upload(file.getBytes(), objectName);
            return Result.success(filePath);
        } catch (IOException e) {
            log.error("文件上传失败：{}", e);
        }
        return Result.error("文件上传失败");
    }
}