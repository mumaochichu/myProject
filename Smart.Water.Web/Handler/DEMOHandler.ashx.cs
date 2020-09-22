using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Smart.Water.Data.Model;
using Smart.Water.Data.DataAccess;
using Robin.XlsIO;
using Robin.EntLib.Common.Helper;
using Robin.Data.Base;
using Robin.EntLib.Data;
using System.IO;
using MongoDB;

namespace Smart.Water.Web.Handler
{
    /// <summary>
    /// DEMOHandler 的摘要说明
    /// </summary>
    public class DEMOHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
          {
            context.Response.ContentType = "text/plain";
            string result = string.Empty;
            string action = context.Request.QueryString["Action"];
            switch (action)
            {
                //获取设备数据
                case "QueryAllData":
                    result = this.GetAllDataList(context);
                    break;
                case "GetList":

                    result = this.GetDataForList(context);
                    break;
                case "Create":
                    result = this.Create(context);
                    break;
                case "Delete":
                    result = this.Delete(context);
                    break;
                case "Edit":
                    result = this.Edit(context);
                    break;
                case "EditSubmit":
                    result = this.EditSubmit(context);
                    break;
                case "GetCoverType":
                    result = this.GetCoverType(context);
                    break;

            }
            context.Response.Write(result);
        }
        /// <summary>
        /// 获取图层枚举列表
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private string GetCoverType(HttpContext context)
        {
            string wherestr = string.Empty;
            string stationKey = context.Request.QueryString["ITEMKEY"];
            DCASE_KEYVALUE dc = new DCASE_KEYVALUE();
            List<CASE_KEYVALUE> dataList = dc.GetList(CASE_KEYVALUE._.ITEMKEY == stationKey);
            string result = JsonHelper.SerializeObject(dataList);
            return result;
        }
        /// <summary>
        /// 获取所有设备数据
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private string GetAllDataList(HttpContext context)
        {
            string where = string.Empty;
            DDEMO dhyrantassert = new DDEMO();
            List<DEMO> dataList = dhyrantassert.GetAllList(new WhereClip(where));
            string result = JsonHelper.SerializeObject(dataList);
            return result;
        }
        //获取已安装井盖监控列表
        private string GetDataForList(HttpContext context)
        {

            string where = string.Empty;
            DDEMO dhyrantassert = new DDEMO();


            string result = string.Empty;
            string iDisplayStart = context.Request["iDisplayStart"];
            string iDisplayLength = context.Request["iDisplayLength"];
            var num = context.Request["coverNum"];
            string echo = context.Request["sEcho"];
            int startIndex = 0, pagesize = 7;
            int.TryParse(iDisplayStart, out startIndex);
            int.TryParse(iDisplayLength, out pagesize);
            int count = 0;
            if (num != null)
            {
                where += " and MACHINECODE is not null";
                where += " and MACHINECODE like '%" + num + "%' ";
              
            }
            else
            {
                where = string.Empty;
            }
            FormatedList<List<DEMO>> formlist = new FormatedList<List<DEMO>>();
            try
            {
                count = dhyrantassert.Count(where);
                formlist.sEcho = int.Parse(echo);
                formlist.iTotalRecords = count;
                formlist.iTotalDisplayRecords = count;
                formlist.aaData = dhyrantassert.GetList(where, startIndex, pagesize);
                result = JsonHelper.SerializeObject(formlist);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
            // List<DEMO> dataList = dhyrantassert.GetAllList(new WhereClip(where));
            //string result = JsonHelper.SerializeObject(dataList);
            return result;
        }
        //添加数据
        private string Create(HttpContext context)
        {
            var formdata = context.Request.Form;
            var wo = new DEMO();
            wo.NVFID = DateTime.Now.ToString();
            wo.MACHINECODE = formdata["MACHINECODE"];
            wo.EXPNUM = formdata["EXPNUM"];
            wo.OWNERSHIPUNIT = formdata["OWNERSHIPUNIT"];
            wo.MANUFACTURE = formdata["MANUFACTURE"];
            wo.INSTALLTIONUNIT = formdata["INSTALLTIONUNIT"];
            wo.INSTALDATE = Convert.ToDateTime(formdata["INSTALDATE"]);
            wo.SERVICELIFE = Convert.ToDecimal(formdata["SERVICELIFE"]);
          
            wo.BATTERYLIFE = Convert.ToDecimal(formdata["BATTERYLIFE"]);
            wo.TIMESLOT = formdata["TIMESLOT"];
            wo.NOTE = formdata["NOTE"];
            //wo.X = formdata["X"];
            //wo.Y = formdata["Y"];
            DDEMO dhyrantassert = new DDEMO();
            dhyrantassert.Insert(wo);
            return string.Empty;

        }
        //删除数据
        private string Delete(HttpContext context)
        {
            string result = "False";
            try
            {
                DDEMO bll = new DDEMO();
                string Id = context.Request.QueryString["NVFID"].ToString();
                if (bll.Delete(Id))
                {
                    result = "true";
                }
                else
                {
                    result = "False";
                }
            }
            catch (Exception ex)
            {
            }
            return result;
        }
        //获取选择数据进行编辑
        private string Edit(HttpContext context)
        {


            var id = context.Request["NVFID"];

            DDEMO bll = new DDEMO();
            var t = bll.GetModel(id);
            string result = JsonHelper.SerializeObject(t);
            return result;
        }
        private string EditSubmit(HttpContext context)
        {

            var formdata = context.Request.Form;
            DDEMO bll = new DDEMO();
            bll.Delete(formdata["NVFID"]);
            var wo = new DEMO();
            wo.NVFID = formdata["NVFID"];
            wo.MACHINECODE = formdata["MACHINECODE"];
            wo.EXPNUM = formdata["EXPNUM"];
            wo.OWNERSHIPUNIT = formdata["OWNERSHIPUNIT"];
            wo.MANUFACTURE = formdata["MANUFACTURE"];
            wo.INSTALLTIONUNIT = formdata["INSTALLTIONUNIT"];
            wo.INSTALDATE = Convert.ToDateTime(formdata["INSTALDATE"]);
            wo.SERVICELIFE = Convert.ToDecimal(formdata["SERVICELIFE"]);
           
            wo.BATTERYLIFE = Convert.ToDecimal(formdata["BATTERYLIFE"]);
            wo.TIMESLOT = formdata["TIMESLOT"];
            wo.NOTE = formdata["NOTE"];
            wo.X = formdata["X"];
            wo.Y = formdata["Y"];
            DDEMO dhyrantassert = new DDEMO();
            dhyrantassert.Insert(wo);
            return string.Empty;
            //WELLCOVER_OPENAPPLICATION wo = JsonConvert.DeserializeObject<WELLCOVER_OPENAPPLICATION>(formdata.ToString());
            //throw new NotImplementedException();
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}