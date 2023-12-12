import { NumberUtils } from '@util/NumberUtils';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface IDescriptionCmp {
  title: string,
  data: any
}

const DescriptionComponent = ({ title, data }: IDescriptionCmp) => {

  return <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <h5 className="mb-5 text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center" >{title}</h5 >
    {data == "" ? <div style={{ height: "344px" }}></div> :
      < div className='grid grid-cols-2 gap-4'>
        <div>
          <img src={`https://zuhot-cinema-images.s3.amazonaws.com/poster-movie/${data.poster}.png`} alt="" />
        </div>
        <div>
          {/* <h1>{data.poster}</h1> */}
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Tên khách hàng: {data.customerName}</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Email: {data.customerEmail}</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Số điện thoại: {data.customerPhone}</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Quốc tịch: {data.country}</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Tên phim: {data.movieName}-{data.languageName}</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Chi nhánh: {data.branchName} - ({data.branchAddress})</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Phòng: {data.roomName}</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Số ghế: {data.seats}</h4>
          {data.toppingName == "" ? <></> :
            <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Số topping: {data.toppingName}</h4>}
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Ngày chiếu: {data.showDate ? format(new Date(data.showDate), 'dd/MM/yyyy') : ''} - (giờ chiếu: {data.startTime})</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Ngày thanh toán: {data.exportDate ? format(new Date(data.exportDate), 'dd/MM/yyyy') : ''}</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Tổng thanh toán: {NumberUtils.formatCurrency(data.ticketTotalPrice)}</h4>
          <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg py-1">Trạng thái: {data.exportStatus == 1 ? "Đã thanh toán" : "Chưa thanh toán"}</h4>
        </div>
      </div>}
  </div >

}
export default DescriptionComponent;