package com.example.ct.Config;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginHandlerInterceptor  implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        Object loginuser=request.getSession().getAttribute("loginUser");
        if(loginuser==null){
            request.setAttribute("warn","Please login first.");
            request.getRequestDispatcher("/curationlogin").forward(request,response);
            return false;
        }
        else{
            request.setAttribute("username",loginuser);
            return true;
        }
    }
}
