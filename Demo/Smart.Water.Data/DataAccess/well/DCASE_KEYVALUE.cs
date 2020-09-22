using System;
using System.Collections.Generic;
using System.Data;
using Robin.EntLib.Data;
using Robin.EntLib.Logging;
using Smart.Water.Data.Model;


namespace Smart.Water.Data.DataAccess
{
    public class DCASE_KEYVALUE
    {
        /// <summary>
        /// 插入数据
        /// </summary>
        public bool Insert(CASE_KEYVALUE model)
        {
            try
            {

                return BasePostgreSQL.EntryInsert(model) > 0;
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return false;
            }
        }

        /// <summary>
        ///  根据主键删除数据
        /// </summary>
        public bool Delete(string id)
        {
            try
            {
                return BasePostgreSQL.DefaultSession.Delete<CASE_KEYVALUE>(CASE_KEYVALUE._.ITEMID == id) > 0;
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return false;
            }
        }


        /// <summary>
        /// 更新数据
        /// </summary>
        public bool Update(CASE_KEYVALUE model)
        {
            try
            {
                return BasePostgreSQL.EntryUpdate(model) > 0;
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return false;
            }
        }

        /// <summary>
        ///  根据主键获取实体
        /// </summary>
        public CASE_KEYVALUE GetModel(string id)
        {
            try
            {
                return BasePostgreSQL.GetEntrySingle<CASE_KEYVALUE>(CASE_KEYVALUE._.ITEMID == id);
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return null;
            }
        }
        /// <summary>
        ///  根据条件获取实体
        /// </summary>
        public CASE_KEYVALUE GetModel(WhereClip clip)
        {
            try
            {
                return BasePostgreSQL.GetEntrySingle<CASE_KEYVALUE>(clip);
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return null;
            }
        }
        /// <summary>
        /// 获得所有数据
        /// </summary>
        /// <returns></returns>
        public DataTable GetTable()
        {

            try
            {
                return BasePostgreSQL.DefaultSession.From<CASE_KEYVALUE>().ToTable() as DataTable;
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return null;
            }
        }

        /// <summary>
        /// 查询记录总数
        /// </summary>
        public int Count(string where)
        {
            string sql =
                string.Format(
                    "select count(*) from ROBIN_WATERUSER_REPLACEBATTERY where 1=1 {0}", where);
            try
            {
                return BasePostgreSQL.DefaultSession.FromSql(sql).ToScalar<int>();
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return 0;
            }
        }
        /// <summary>
        /// 定义新的获取所有数据的的方法（张保东）
        /// </summary>
        /// <returns></returns>
        public List<CASE_KEYVALUE> GetAllList(WhereClip clip)
        {
            try
            {
                return BasePostgreSQL.DefaultSession.From<CASE_KEYVALUE>().Where(clip).ToList<CASE_KEYVALUE>();
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return null;
            }
        }

        /// <summary>
        /// 获取分页数据
        /// </summary>
        /// <param name="where">查询条件</param>
        /// <param name="start">数据开始索引</param>
        /// <param name="end">数据结束索引</param>
        /// <returns></returns>
        public List<CASE_KEYVALUE> GetList(string where, int start, int end)
        {
            try
            {
                string sql = BasePostgreSQL.GetPagedSql(string.Format(" select * from ROBIN_WATERUSER_REPLACEBATTERY where 1=1 {0}", where), start, end);
                return BasePostgreSQL.DefaultSession.FromSql(sql).ToList<CASE_KEYVALUE>();
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return null;
            }
        }

        /// <summary>
        /// 获得符合条件列表
        /// </summary>    
        /// <returns></returns>
        public List<CASE_KEYVALUE> GetList(WhereClip clip)
        {
            try
            {
                return BasePostgreSQL.DefaultSession.From<CASE_KEYVALUE>().Where(clip).ToList<CASE_KEYVALUE>();
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return null;
            }
        }
        /// <summary>
        /// 是否存在数据
        /// </summary>
        /// <param name="where">查询条件</param>
        /// <returns></returns>
        public bool Exists(WhereClip where)
        {
            try
            {
                return BasePostgreSQL.DefaultSession.Exists<CASE_KEYVALUE>(where);
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return true;
            }
        }
    }
}
