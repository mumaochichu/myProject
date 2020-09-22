using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using Robin.EntLib.Data;

namespace Smart.Water.Data
{
    public class BasePostgreSQL
    {
        
        /// <summary>
        /// 通过配置节来实例化DbSession
        /// 默认为主数据库连接(Oracle)
        /// </summary>
        public static readonly DbSession DefaultSession = new DbSession("OracleDSN");
        ///// <summary>
        ///// 通过配置节来实例化DbSession
        ///// 默认为主数据库连接(Oracle),并且是图形数据库
        ///// </summary>
        //public static readonly DbSession DefaultSessionData = new DbSession("AppCenterDATA");
        ///// <summary>
        ///// 通过自定义类来实例化DbSession
        ///// 带调试语句输出
        ///// </summary>
        //public static readonly DbOracleTest DbSessionOracle = new DbOracleTest();

        #region 非实体操作通用方法
        /// <summary>
        /// 系统通用的查询接口，可以利用开放的SQL进行数据访问。返回DataSet
        /// <remarks>
        /// <para>
        /// 针对拼接好的SQL语句
        /// </para>
        /// </remarks>
        /// <example>
        /// <para>
        ///    执行一条查询语句
        /// </para>
        /// <code lang="C#">
        /// <![CDATA[
        ///     string sql = "SELECT LOGINID FROM SYS_INNERUSER";
        ///     DataSet ds = CDS_Base.PublicSeekSet(sql);
        /// ]]>
        /// </code>
        /// </example>
        /// </summary>
        public static DataSet PublicSeekSet(string pamSQL)
        {
            DataSet ds = DefaultSession.FromSql(pamSQL).ToDataSet();
            return ds;
        }
        /// <summary>
        /// 系统通用的查询接口，可以利用开放的SQL进行数据访问。返回DataSet
        /// <para>
        /// 针对参数数组,用于条件查询
        /// </para>
        /// </remarks>
        /// <example>
        /// <para>
        ///    执行一条查询语句
        /// </para>
        /// </example>
        /// </summary>
        public static DataSet PublicSeekSet(string pamSQL, Dictionary<string, object> pamParmes)
        {
            DataSet ds = DefaultSession.FromSql(pamSQL).AddParameters(pamParmes).ToDataSet();
            return ds;
        }
        /// <summary>
        /// 系统通用的查询接口，可以利用开放的SQL进行数据访问。返回DataSet
        /// <para>
        /// 针对单个参数，无需定义大小的时候
        /// </para>
        /// </remarks>
        /// <example>
        /// <para>
        ///    执行一条查询语句
        /// </para>
        /// <code lang="C#">
        /// <![CDATA[
        ///     string sql = "SELECT LOGINID FROM SYS_INNERUSER WHERE USERID=$USERID";
        ///     DataSet ds = CDS_Base.PublicSeekSet(sql,"$USERID",DbType.Int32,1);
        /// ]]>
        /// </code>
        /// </example>
        /// </summary>
        public static DataSet PublicSeekSet(string pamSQL, string pamParamName, DbType pamType, object pamValue)
        {
            DataSet ds = DefaultSession.FromSql(pamSQL).AddInputParameter(pamParamName, pamType, pamValue).ToDataSet();
            return ds;
        }
        /// <summary>
        /// 系统通用的查询接口，可以利用开放的SQL进行数据访问。返回DataSet
        /// <para>
        /// 针对单个参数，需定义大小的时候
        /// </para>
        /// </remarks>
        /// <example>
        /// <para>
        ///    执行一条查询语句
        /// </para>
        /// <code lang="C#">
        /// <![CDATA[
        ///     string sql = "SELECT LOGINID FROM SYS_INNERUSER WHERE USERID=$USERID";
        ///     DataSet ds = CDS_Base.PublicSeekSet(sql,"$USERID",DbType.Int32,4,1);
        /// ]]>
        /// </code>
        /// </example>
        /// </summary>
        public static DataSet PublicSeekSet(string pamSQL, string pamParamName, DbType pamType, int pamSize, object pamValue)
        {
            DataSet ds = DefaultSession.FromSql(pamSQL).AddInputParameter(pamParamName, pamType, pamSize, pamValue).ToDataSet();
            return ds;
        }
        /// <summary>
        /// 针对于SQL方式查询记录数
        /// 暂时不增加重载，需要特别处理的话，封装SQL来实现
        /// </summary>
        /// <param name="pamSQL">查询记录数的SQL语句,"select count(*) ...."</param>
        /// <returns></returns>
        public static int PublicCountSeek(string pamSQL)
        {
            return int.Parse(DefaultSession.FromSql(pamSQL).ToScalar().ToString());
        }
        /// <summary>
        /// 针对于SQL方式返回记录影响的行数（增删改查）
        /// </summary>
        /// <param name="pamSQL"></param>
        /// <returns></returns>
        public static int PublicChange(string pamSQL)
        {
            return DefaultSession.FromSql(pamSQL).Execute();
        }
        /// <summary>
        /// 执行存储过程
        /// 只有一个参数的时候
        /// </summary>
        /// <param name="pamProcName">存储过程名称</param>
        /// <param name="pamParamName">参数名</param>
        /// <param name="pamType">参数类型</param>
        /// <param name="pamValue">值</param>
        /// <returns>返回执行存储过程影响的条数</returns>
        public static int PublicProc(string pamProcName, string pamParamName, DbType pamType, object pamValue)
        {
            return DefaultSession.FromProc(pamProcName).AddInputParameter(pamParamName, pamType, pamValue).Execute();
        }
        /// <summary>
        /// 支持事务处理的非查询语句,使用数组方式
        /// </summary>
        /// <param name="pamSqlList"></param>
        /// <returns>无异常返回true</returns>
        public static bool PublicTrans(string[] pamSqlList)
        {
            using (DbTransaction trans = DefaultSession.BeginTransaction())
            {
                try
                {
                    if (pamSqlList.Length > 0 && pamSqlList != null)
                    {
                        for (int i = 0; i < pamSqlList.Length; i++)
                        {
                            if (pamSqlList[i] != null && pamSqlList[i].ToString() != "")
                            {
                                DefaultSession.SetTransaction(trans).FromSql(pamSqlList[i]).Execute();
                            }
                        }
                        trans.Commit();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                catch
                {
                    trans.Rollback();
                    return false;
                }
            }
        }
        /// <summary>
        /// 支持事务处理的非查询语句,使用ArrayList方式 ,pamSign无实际意义
        /// </summary>
        /// <param name="pamSqlList"></param>
        /// <returns>无异常返回true</returns>
        public static bool PublicTrans(ArrayList pamSqlList, bool pamSign)
        {
            using (DbTransaction trans = DefaultSession.BeginTransaction())
            {
                try
                {
                    if (pamSqlList.Count > 0 && pamSqlList != null)
                    {
                        for (int i = 0; i < pamSqlList.Count; i++)
                        {
                            DefaultSession.SetTransaction(trans).FromSql(pamSqlList[i].ToString()).Execute();
                        }
                        trans.Commit();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                catch
                {
                    trans.Rollback();
                    return false;
                }
            }
        }
        #endregion

        #region 针对于实体操作
        /// <summary>
        /// 插入一个实体
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static int EntryInsert<T>(T entity) where T : Entity
        {
            entity.Detach();
            return entity == null ? 0 : DefaultSession.Save<T>(entity);
        }
        /// <summary>
        /// 插入一个实体，返回自增字段值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity"></param>
        /// <param name="identityValue"></param>
        /// <returns></returns>
        //public static int EntryInsert<T>(T entity, out int identityValue) where T : Entity
        //{
        //    try
        //    {
        //        InsertCreator creator = InsertCreator.NewCreator()
        //            .SetEntity<T>(entity);

        //        return DefaultSession.Excute(creator, out identityValue);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message, ex);
        //    }
        //}
        /// <summary>
        /// 更新一个实体
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static int EntryUpdate<T>(T entity) where T : Entity
        {
            entity.Attach();
            return DefaultSession.Save<T>(entity);
        }
        /// <summary>
        /// 是否存在指定条件的记录
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public static bool EntryExists<T>(WhereClip where) where T : Entity
        {
            return DefaultSession.Exists<T>(where);
        }
        /// <summary>
        /// 按条件获取记录条数
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public static int EntryCount<T>(WhereClip where) where T : Entity
        {
            return DefaultSession.Count<T>(where);
        }
        /// <summary>
        /// 根据条件获取实体列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public static List<T> GetEntryList<T>(WhereClip where) where T : Entity
        {
            return DefaultSession.From<T>().Where(where).ToList<T>();
        }
        /// <summary>
        /// 根据条件获取实体列表(排序)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public static List<T> GetEntryList<T>(WhereClip where, OrderByClip order) where T : Entity
        {
            return DefaultSession.From<T>().Where(where).OrderBy(order).ToList<T>();
        }
        /// <summary>
        /// 根据sql查询分页实体列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        //public static List<T> GetEntryList<T>(string sql, int pageIndex, int pageSize) where T : Entity
        //{
        //    sql = CommonMethod.GetPagedSql(sql, pageIndex * pageSize, pageSize);
        //    return DefaultSession.FromSql(sql).ToList<T>();
        //}

        /// <summary>
        /// 根据sql查询分页实体列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public static List<T> GetEntryList<T>(string sql) where T : Entity
        {
            return DefaultSession.FromSql(sql).ToList<T>();
        }
        /// <summary>
        /// 根据条件获取实体
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public static T GetEntrySingle<T>(WhereClip where) where T : Entity
        {
            return DefaultSession.Single<T>(where);
        }
        /// <summary>
        /// 根据主键获取实体，只针对于定义主键的实体
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="pkValues"></param>
        /// <returns></returns>
        public static T GetEntrySingle<T>(params object[] pkValues) where T : Entity
        {
            return DefaultSession.Single<T>(pkValues);
        }

        #endregion

        /// <summary>
        /// 获取序列值
        /// </summary>
        /// <param name="sequenceName">序列名称；例如gtxm.seq_tab_id</param>
        /// <returns></returns>
        public static int GetSequenceNextval(string sequenceName)
        {
            string sql = "select " + sequenceName + ".nextval as id from dual";
            //只返回一行一列
            int id = Convert.ToInt32(DefaultSession.FromSql(sql).ToScalar());
            return id;
        }

        /// <summary>
        /// Oracle分页方法
        /// </summary>
        /// <param name="pamStrSql">原sql</param>
        /// <param name="pamStartRecord">从其开始的从零开始的记录号。如前十条则值为0</param>
        /// <param name="pamPageSize">每页最大记录数</param>
        /// <returns>可分页的sql</returns>
        public static string GetPagedSql(string pamStrSql, int pamStartRecord, int pamPageSize)
        {
            return string.Format("select * from (select mrs.*,rownum uniquerownum from ({0}) mrs where rownum < {1}) where uniquerownum > {2}",
                pamStrSql, pamStartRecord + pamPageSize + 1, pamStartRecord);
        }
    }
    //    /// <summary>
    //    /// DbOracleTest会话类
    //    /// Oracle测试用
    //    /// </summary>
    //    public class DbOracleTest : DbSession
    //    {
    //        public DbOracleTest()
    //            : base("AppCenterDSN")
    //        {
    //#if DEBUG
    //            this.RegisterSqlLogger(log =>
    //            {
    //                System.IO.File.WriteAllText("c:\\log.txt", log);
    //            });
    //#endif
    //        }   
    //    }
   
}
