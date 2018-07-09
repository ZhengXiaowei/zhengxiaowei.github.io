---
title: 分页
---

# 分页

::: tip 提示
仅对数据格式: {data:list:{},meta:{}}有效
:::

meta 格式推荐:

```json
meta: {
  current_page:1,     #当前页
  last_page:1,        #最后一页
  next_page_url:"",   #下一页地址
  per_page:15,        #每页数据条数
  prev_page_url:"",   #上一页地址
  total:11            #总数据条数
}
```

```javascript
const getPageData = (meta, params = {}) => {
  if (typeof meta !== 'object') return Promise.reject('分页格式不正确')
  else if (params !== '' && typeof params !== 'object')
    return Promise.reject('参数不正确')
  else if (meta.current_page + 1 > meta.last_page)
    return Promise.reject('已经是最后一页了')
  else {
    let p = Object.assign(params, { page_size: meta.per_page })
    let url = meta.next_page_url
    return axios(url, {
      data: p
    })
  }
}
```

::: tip 提示
别的数据格式可对代码做适当调整
:::