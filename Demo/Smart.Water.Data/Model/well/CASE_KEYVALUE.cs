namespace Smart.Water.Data.Model
{
    using System;
    using Robin.EntLib.Data;


    /// <summary>
    /// 表名：CASE_KEYVALUE 主键列：ITEMID
    /// </summary>
    [SerializableAttribute()]
        public partial class CASE_KEYVALUE : Entity {
            
            protected String _ITEMID;
            
            protected String _ITEMKEY;
            
            protected String _ITEMVALUE;
            
            /// <summary>
            /// 记录ID
            /// </summary>
            public String ITEMID {
                get {
                    return this._ITEMID;
                }
                set {
                    this.OnPropertyValueChange(_.ITEMID, _ITEMID, value);
                    this._ITEMID = value;
                }
            }
            
            /// <summary>
            /// 键值Key
            /// </summary>
            public String ITEMKEY {
                get {
                    return this._ITEMKEY;
                }
                set {
                    this.OnPropertyValueChange(_.ITEMKEY, _ITEMKEY, value);
                    this._ITEMKEY = value;
                }
            }
            
            /// <summary>
            /// 键值Value
            /// </summary>
            public String ITEMVALUE {
                get {
                    return this._ITEMVALUE;
                }
                set {
                    this.OnPropertyValueChange(_.ITEMVALUE, _ITEMVALUE, value);
                    this._ITEMVALUE = value;
                }
            }
            
            /// <summary>
            /// 获取实体对应的表名
            /// </summary>
            protected override Table GetTable() {
                return new Table<CASE_KEYVALUE>("CASE_KEYVALUE");
            }
            
            /// <summary>
            /// 获取实体中的主键列
            /// </summary>
            protected override Field[] GetPrimaryKeyFields() {
                return new Field[] {
                        _.ITEMID};
            }
            
            /// <summary>
            /// 获取列信息
            /// </summary>
            protected override Field[] GetFields() {
                return new Field[] {
                        _.ITEMID,
                        _.ITEMKEY,
                        _.ITEMVALUE};
            }
            
            /// <summary>
            /// 获取列数据
            /// </summary>
            protected override object[] GetValues() {
                return new object[] {
                        this._ITEMID,
                        this._ITEMKEY,
                        this._ITEMVALUE};
            }
            
            /// <summary>
            /// 给当前实体赋值
            /// </summary>
            protected override void SetValues(IRowReader reader) {
                if ((false == reader.IsDBNull(_.ITEMID))) {
                    this._ITEMID = reader.GetString(_.ITEMID);
                }
                if ((false == reader.IsDBNull(_.ITEMKEY))) {
                    this._ITEMKEY = reader.GetString(_.ITEMKEY);
                }
                if ((false == reader.IsDBNull(_.ITEMVALUE))) {
                    this._ITEMVALUE = reader.GetString(_.ITEMVALUE);
                }
            }
            
            public override int GetHashCode() {
                return base.GetHashCode();
            }
            
            public override bool Equals(object obj) {
                if ((obj == null)) {
                    return false;
                }
                if ((false == typeof(CASE_KEYVALUE).IsAssignableFrom(obj.GetType()))) {
                    return false;
                }
                if ((((object)(this)) == ((object)(obj)))) {
                    return true;
                }
                return false;
            }
            
            public class _ {
                
                /// <summary>
                /// 表示选择所有列，与*等同
                /// </summary>
                public static AllField All = new AllField<CASE_KEYVALUE>();
                
                /// <summary>
                /// 记录ID - 字段名：ITEMID - 数据类型：String
                /// </summary>
                public static Field ITEMID = new Field<CASE_KEYVALUE>("ITEMID");
                
                /// <summary>
                /// 键值Key - 字段名：ITEMKEY - 数据类型：String
                /// </summary>
                public static Field ITEMKEY = new Field<CASE_KEYVALUE>("ITEMKEY");
                
                /// <summary>
                /// 键值Value - 字段名：ITEMVALUE - 数据类型：String
                /// </summary>
                public static Field ITEMVALUE = new Field<CASE_KEYVALUE>("ITEMVALUE");
            }
        }
    }
