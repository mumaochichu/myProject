namespace Smart.Water.Data.Model
{
    using System;
    using Robin.EntLib.Data;


    /// <summary>
    /// 表名：DEMO 主键列：
    /// </summary>
    [SerializableAttribute()]
    public partial class DEMO : Entity
    {

        protected String _NVFID;

        protected String _MACHINECODE;

        protected String _TIMESLOT;

        protected String _EXPNUM;

        protected String _X;

        protected String _Y;

        protected Decimal? _SERVICELIFE;

        protected Decimal? _BATTERYLIFE;

        protected DateTime? _INSTALDATE;

        protected String _MANUFACTURE;

        protected String _INSTALLTIONUNIT;

        protected String _OWNERSHIPUNIT;

        protected String _NOTE;

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
        /// 设备编号
        /// </summary>
        public String MACHINECODE
        {
            get
            {
                return this._MACHINECODE;
            }
            set
            {
                this.OnPropertyValueChange(_.MACHINECODE, _MACHINECODE, value);
                this._MACHINECODE = value;
            }
        }

        /// <summary>
        /// 设备时段
        /// </summary>
        public String TIMESLOT
        {
            get
            {
                return this._TIMESLOT;
            }
            set
            {
                this.OnPropertyValueChange(_.TIMESLOT, _TIMESLOT, value);
                this._TIMESLOT = value;
            }
        }

        /// <summary>
        /// 物探点号
        /// </summary>
        public String EXPNUM
        {
            get
            {
                return this._EXPNUM;
            }
            set
            {
                this.OnPropertyValueChange(_.EXPNUM, _EXPNUM, value);
                this._EXPNUM = value;
            }
        }

        /// <summary>
        /// X坐标
        /// </summary>
        public String X
        {
            get
            {
                return this._X;
            }
            set
            {
                this.OnPropertyValueChange(_.X, _X, value);
                this._X = value;
            }
        }

        /// <summary>
        /// Y坐标
        /// </summary>
        public String Y
        {
            get
            {
                return this._Y;
            }
            set
            {
                this.OnPropertyValueChange(_.Y, _Y, value);
                this._Y = value;
            }
        }

        /// <summary>
        /// 设备寿命
        /// </summary>
        public Decimal? SERVICELIFE
        {
            get
            {
                return this._SERVICELIFE;
            }
            set
            {
                this.OnPropertyValueChange(_.SERVICELIFE, _SERVICELIFE, value);
                this._SERVICELIFE = value;
            }
        }

        /// <summary>
        /// 电池寿命
        /// </summary>
        public Decimal? BATTERYLIFE
        {
            get
            {
                return this._BATTERYLIFE;
            }
            set
            {
                this.OnPropertyValueChange(_.BATTERYLIFE, _BATTERYLIFE, value);
                this._BATTERYLIFE = value;
            }
        }

        /// <summary>
        /// 安装日期
        /// </summary>
        public DateTime? INSTALDATE
        {
            get
            {
                return this._INSTALDATE;
            }
            set
            {
                this.OnPropertyValueChange(_.INSTALDATE, _INSTALDATE, value);
                this._INSTALDATE = value;
            }
        }

        /// <summary>
        /// 生产厂家
        /// </summary>
        public String MANUFACTURE
        {
            get
            {
                return this._MANUFACTURE;
            }
            set
            {
                this.OnPropertyValueChange(_.MANUFACTURE, _MANUFACTURE, value);
                this._MANUFACTURE = value;
            }
        }

        /// <summary>
        /// 安装单位
        /// </summary>
        public String INSTALLTIONUNIT
        {
            get
            {
                return this._INSTALLTIONUNIT;
            }
            set
            {
                this.OnPropertyValueChange(_.INSTALLTIONUNIT, _INSTALLTIONUNIT, value);
                this._INSTALLTIONUNIT = value;
            }
        }

        /// <summary>
        /// 管理单位
        /// </summary>
        public String OWNERSHIPUNIT
        {
            get
            {
                return this._OWNERSHIPUNIT;
            }
            set
            {
                this.OnPropertyValueChange(_.OWNERSHIPUNIT, _OWNERSHIPUNIT, value);
                this._OWNERSHIPUNIT = value;
            }
        }

        /// <summary>
        /// 备注
        /// </summary>
        public String NOTE
        {
            get
            {
                return this._NOTE;
            }
            set
            {
                this.OnPropertyValueChange(_.NOTE, _NOTE, value);
                this._NOTE = value;
            }
        }

        /// <summary>
        /// 获取实体对应的表名
        /// </summary>
        protected override Table GetTable()
        {
            return new Table<DEMO>("DEMO");
        }

        /// <summary>
        /// 获取列信息
        /// </summary>
        protected override Field[] GetFields()
        {
            return new Field[] {
                        _.NVFID,
                        _.MACHINECODE,
                        _.TIMESLOT,
                        _.EXPNUM,
                        _.X,
                        _.Y,
                        _.SERVICELIFE,
                        _.BATTERYLIFE,
                        _.INSTALDATE,
                        _.MANUFACTURE,
                        _.INSTALLTIONUNIT,
                        _.OWNERSHIPUNIT,
                        _.NOTE};
        }

        /// <summary>
        /// 获取列数据
        /// </summary>
        protected override object[] GetValues()
        {
            return new object[] {
                        this._NVFID,
                        this._MACHINECODE,
                        this._TIMESLOT,
                        this._EXPNUM,
                        this._X,
                        this._Y,
                        this._SERVICELIFE,
                        this._BATTERYLIFE,
                        this._INSTALDATE,
                        this._MANUFACTURE,
                        this._INSTALLTIONUNIT,
                        this._OWNERSHIPUNIT,
                        this._NOTE};
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
            if ((false == reader.IsDBNull(_.MACHINECODE)))
            {
                this._MACHINECODE = reader.GetString(_.MACHINECODE);
            }
            if ((false == reader.IsDBNull(_.TIMESLOT)))
            {
                this._TIMESLOT = reader.GetString(_.TIMESLOT);
            }
            if ((false == reader.IsDBNull(_.EXPNUM)))
            {
                this._EXPNUM = reader.GetString(_.EXPNUM);
            }
            if ((false == reader.IsDBNull(_.X)))
            {
                this._X = reader.GetString(_.X);
            }
            if ((false == reader.IsDBNull(_.Y)))
            {
                this._Y = reader.GetString(_.Y);
            }
            if ((false == reader.IsDBNull(_.SERVICELIFE)))
            {
                this._SERVICELIFE = reader.GetDecimal(_.SERVICELIFE);
            }
            if ((false == reader.IsDBNull(_.BATTERYLIFE)))
            {
                this._BATTERYLIFE = reader.GetDecimal(_.BATTERYLIFE);
            }
            if ((false == reader.IsDBNull(_.INSTALDATE)))
            {
                this._INSTALDATE = reader.GetDateTime(_.INSTALDATE);
            }
            if ((false == reader.IsDBNull(_.MANUFACTURE)))
            {
                this._MANUFACTURE = reader.GetString(_.MANUFACTURE);
            }
            if ((false == reader.IsDBNull(_.INSTALLTIONUNIT)))
            {
                this._INSTALLTIONUNIT = reader.GetString(_.INSTALLTIONUNIT);
            }
            if ((false == reader.IsDBNull(_.OWNERSHIPUNIT)))
            {
                this._OWNERSHIPUNIT = reader.GetString(_.OWNERSHIPUNIT);
            }
            if ((false == reader.IsDBNull(_.NOTE)))
            {
                this._NOTE = reader.GetString(_.NOTE);
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
            if ((false == typeof(DEMO).IsAssignableFrom(obj.GetType())))
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
            public static AllField All = new AllField<DEMO>();

            /// <summary>
            /// 主键列 - 字段名：NVFID - 数据类型：String
            /// </summary>
            public static Field NVFID = new Field<DEMO>("NVFID");

            /// <summary>
            /// 设备编号 - 字段名：MACHINECODE - 数据类型：String
            /// </summary>
            public static Field MACHINECODE = new Field<DEMO>("MACHINECODE");

            /// <summary>
            /// 设备时段 - 字段名：TIMESLOT - 数据类型：String
            /// </summary>
            public static Field TIMESLOT = new Field<DEMO>("TIMESLOT");

            /// <summary>
            /// 物探点号 - 字段名：EXPNUM - 数据类型：String
            /// </summary>
            public static Field EXPNUM = new Field<DEMO>("EXPNUM");

            /// <summary>
            /// X坐标 - 字段名：X - 数据类型：String
            /// </summary>
            public static Field X = new Field<DEMO>("X");

            /// <summary>
            /// Y坐标 - 字段名：Y - 数据类型：String
            /// </summary>
            public static Field Y = new Field<DEMO>("Y");

            /// <summary>
            /// 设备寿命 - 字段名：SERVICELIFE - 数据类型：Decimal(可空)
            /// </summary>
            public static Field SERVICELIFE = new Field<DEMO>("SERVICELIFE");

            /// <summary>
            /// 电池寿命 - 字段名：BATTERYLIFE - 数据类型：Decimal(可空)
            /// </summary>
            public static Field BATTERYLIFE = new Field<DEMO>("BATTERYLIFE");

            /// <summary>
            /// 安装日期 - 字段名：INSTALDATE - 数据类型：DateTime(可空)
            /// </summary>
            public static Field INSTALDATE = new Field<DEMO>("INSTALDATE");

            /// <summary>
            /// 生产厂家 - 字段名：MANUFACTURE - 数据类型：String
            /// </summary>
            public static Field MANUFACTURE = new Field<DEMO>("MANUFACTURE");

            /// <summary>
            /// 安装单位 - 字段名：INSTALLTIONUNIT - 数据类型：String
            /// </summary>
            public static Field INSTALLTIONUNIT = new Field<DEMO>("INSTALLTIONUNIT");

            /// <summary>
            /// 管理单位 - 字段名：OWNERSHIPUNIT - 数据类型：String
            /// </summary>
            public static Field OWNERSHIPUNIT = new Field<DEMO>("OWNERSHIPUNIT");

            /// <summary>
            /// 备注 - 字段名：NOTE - 数据类型：String
            /// </summary>
            public static Field NOTE = new Field<DEMO>("NOTE");
        }
    }
}
