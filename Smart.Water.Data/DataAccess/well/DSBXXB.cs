using System;
using System.Collections.Generic;
using System.Data;
using Robin.EntLib.Data;
using Robin.EntLib.Logging;
using Smart.Water.Data.Model;
using DbHelper = Robin.Data.Base.DbHelper;

namespace Smart.Water.Data.DataAccess
{
    public class DSBXXB
    {
        /// <summary>
        /// 插入数据
        /// </summary>
        public bool Insert(SBXXB model)
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
                return BasePostgreSQL.DefaultSession.Delete<SBXXB>(SBXXB._.NVFID == id) > 0;
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
        public bool Update(SBXXB model)
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
        public SBXXB GetModel(string id)
        {
            try
            {
                return BasePostgreSQL.GetEntrySingle<SBXXB>(SBXXB._.NVFID == id);
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
        public SBXXB GetModel(WhereClip clip)
        {
            try
            {
                return BasePostgreSQL.GetEntrySingle<SBXXB>(clip);
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
                return BasePostgreSQL.DefaultSession.From<SBXXB>().ToTable() as DataTable;
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
                    "select count(*) from SBXXB where 1=1 {0}", where);
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
        public List<SBXXB> GetDatalist(string where)
        {
            string sql =
               string.Format(
                   "select * from SBXXB where 1=1 {0}",
                   where);
            try
            {
                return BasePostgreSQL.DefaultSession.FromSql(sql).ToList<SBXXB>();
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return null;
            }
        }
        /// <summary>
        /// 定义新的获取所有数据的的方法（张保东）
        /// </summary>
        /// <returns></returns>
        public List<SBXXB> GetAllList(WhereClip clip)
        {
            try
            {
                return BasePostgreSQL.DefaultSession.From<SBXXB>().Where(clip).ToList<SBXXB>();
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
        public List<SBXXB> GetList(string where, int start, int end)
        {
            try
            {
                string sql = BasePostgreSQL.GetPagedSql(string.Format(" select * from SBXXB where 1=1 {0}", where), start, end);
                return BasePostgreSQL.DefaultSession.FromSql(sql).ToList<SBXXB>();
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
        public List<SBXXB> GetList(WhereClip clip)
        {
            try
            {
                return BasePostgreSQL.DefaultSession.From<SBXXB>().Where(clip).ToList<SBXXB>();
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
                return BasePostgreSQL.DefaultSession.Exists<SBXXB>(where);
            }
            catch (Exception ex)
            {
                LogManager.DefaultLogger.Error(ex);
                return true;
            }
        }

        public static implicit operator DSBXXB(SBXXB v)
        {
            throw new NotImplementedException();
        }
    }
}
