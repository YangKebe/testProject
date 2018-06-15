
#用途：封装了一个验证码图片，点击图片发起图片刷新请求

#props:
   - rootUrl：图片刷新请求的url的部分链接,此部分加上组件中Math.random()形成完整的请求。

#demo:
````jsx

    <Col span={8}>
      <RndImg rootUrl={'http:172.16.11.30/security/vcode?sysCode=102006&'} />
    </Col>

````