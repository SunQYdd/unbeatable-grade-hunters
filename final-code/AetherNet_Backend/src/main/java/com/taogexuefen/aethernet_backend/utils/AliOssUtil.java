package com.taogexuefen.aethernet_backend.utils;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.PutObjectRequest;
import lombok.extern.slf4j.Slf4j;

import java.io.ByteArrayInputStream;

/**
 * 阿里云文件上传工具类
 */
@Slf4j
//@Component
public class AliOssUtil {
    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;

    public AliOssUtil(String endpoint, String accessKeyId, String accessKeySecret, String bucketName) {
        this.endpoint = endpoint;
        this.accessKeyId = accessKeyId;
        this.accessKeySecret = accessKeySecret;
        this.bucketName = bucketName;
    }

    /**
     * 文件上传
     *
     * @param bytes 文件字节数组
     * @param objectName 对象名称
     * @return 文件访问路径
     */
    public String upload(byte[] bytes, String objectName) {
        // 创建OSSClient实例
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

        try {
            // 创建PutObjectRequest对象
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, objectName,
                    new ByteArrayInputStream(bytes));

            // 上传文件
            ossClient.putObject(putObjectRequest);

            // 生成文件访问路径
            String url = "https://" + bucketName + "." + endpoint + "/" + objectName;
            log.info("文件上传成功，访问地址：{}", url);
            return url;
        } catch (OSSException oe) {
            log.error("OSS异常，错误代码: {}, 错误信息: {}, 请求ID: {}", oe.getErrorCode(), oe.getMessage(), oe.getRequestId());
            throw new RuntimeException("文件上传失败");
        } catch (ClientException ce) {
            log.error("客户端异常，错误信息: {}", ce.getMessage());
            throw new RuntimeException("文件上传失败");
        } catch (Exception e) {
            log.error("文件上传失败", e);
            throw new RuntimeException("文件上传失败");
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
    }
}