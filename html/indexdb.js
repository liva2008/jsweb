/*indexdb数据库jscoding
 * 历史记录表：
 * history(key,content)
 * key:文件名+创建时间，为主键
 * filename:文件名
 * createtime:创建时间
 * content:文件内容
 */
let db = new Dexie("jsweb");
db.version(1).stores({
  users: "id++, username,password"
});


/*
Chrome will automatically grant the persistence permission if any of the following are true:

The site is bookmarked (and the user has 5 or less bookmarks)
The site has high site engagement
The site has been added to home screen
The site has push notifications enabled
*/

async function persist() {
  return await navigator.storage && navigator.storage.persist &&
    navigator.storage.persist();
}


async function isStoragePersisted() {
  return await navigator.storage && navigator.storage.persisted &&
    navigator.storage.persisted();
}

isStoragePersisted().then(async isPersisted => {
  if (isPersisted) {
    console.log(":) Storage is successfully persisted.");
  } else {
    console.log(":( Storage is not persisted.");
    console.log("Trying to persist..:");
    if (await persist()) {
      console.log(":) We successfully turned the storage to be persisted.");
    } else {
      console.log(":( Failed to make storage persisted");
    }
  }
})

async function showEstimatedQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimation = await navigator.storage.estimate();
    console.log(`Quota: ${estimation.quota}`);
    console.log(`Usage: ${estimation.usage}`);
  } else {
    console.error("StorageManager not found");
  }
}

showEstimatedQuota();