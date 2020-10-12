namespace Smart.Water.Data.Model
{
    using System;
    using Robin.EntLib.Data;


    /// <summary>
    /// 表名：SBXXB 主键列：
    /// </summary>
    [SerializableAttribute()]
    public partial class SBXXB : Entity
    {

        protected String _NVFID;

        protected String _WYBH;

        protected String _SBMC;

        /// <summary>
        /// 主键列
        /// </summary>
        public String NVFID
        {
            get
            {
                return this._NVFID;
            }
            set
            {
                this.OnPropertyValueChange(_.NVFID, _NVFID, value);
                this._NVFID = value;
            }
        }

        /// <summary>
        /// 唯一编号
        /// </summary>
        public String WYBH
        {
            get
            {
                return this._WYBH;
            }
            set
            {
                this.OnPropertyValueChange(_.WYBH, _WYBH, value);
                this._WYBH = value;
            }
        }

        /// <summary>
        /// 设备名称
        /// </summary>
        public String SBMC
        {
            get
            {
                return this._SBMC;
            }
            set
            {
                this.OnPropertyValueChange(_.SBMC, _SBMC, value);
                this._SBMC = value;
            }
        }

        /// <summary>
        /// 获取实体对应的表名
        /// </summary>
        protected override Table GetTable()
        {
            return new Table<SBXXB>("SBXXB");
        }

        /// <summary>
        /// 获取列信息
        /// </summary>
        protected override Field[] GetFields()
        {
            return new Field[] {
                        _.NVFID,
                        _.WYBH,
                        _.SBMC};
        }

        /// <summary>
        /// 获取列数据
        /// </summary>
        protected override object[] GetValues()
        {
            return new object[] {
                        this._NVFID,
                        this._WYBH,
                        this._SBMC};
        }

        /// <summary>
        /// 给当前实体赋值
        /// </summary>
        protected override void SetValues(IRowReader reader)
        {
            if ((false == reader.IsDBNull(_.NVFID)))
            {
                this._NVFID = reader.GetString(_.NVFID);
            }
            if ((false == reader.IsDBNull(_.WYBH)))
            {
                this._WYBH = reader.GetString(_.WYBH);
            }
            if ((false == reader.IsDBNull(_.SBMC)))
            {
                this._SBMC = reader.GetString(_.SBMC);
            }
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override bool Equals(object obj)
        {
            if ((obj == null))
            {
                return false;
            }
            if ((false == typeof(SBXXB).IsAssignableFrom(obj.GetType())))
            {
                return false;
            }
            if ((((object)(this)) == ((object)(obj))))
            {
                return true;
            }
            return false;
        }

        public class _
        {

            /// <summary>
            /// 表示选择所有列，与*等同
            /// </summary>
            public static AllField All = new AllField<SBXXB>();

            /// <summary>
            /// 主键列 - 字段名：NVFID - 数据类型：String
            /// </summary>
            public static Field NVFID = new Field<SBXXB>("NVFID");

            /// <summary>
            /// 唯一编号 - 字段名：WYBH - 数据类型：String
            /// </summary>
            public static Field WYBH = new Field<SBXXB>("WYBH");

            /// <summary>
            /// 设备名称 - 字段名：SBMC - 数据类型：String
            /// </summary>
            public static Field SBMC = new Field<SBXXB>("SBMC");
        }
    }
}
