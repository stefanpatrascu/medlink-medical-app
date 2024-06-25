package com.medical.app.util;

import com.medical.app.exception.NotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.Map;
import org.jxls.common.Context;
import org.jxls.util.JxlsHelper;

public class CreateReportUtil {

  public static void createReport(

      HttpServletResponse response,
      Map<String, Object> data,
      String templateName,
      String expotedFileName) {

    try (InputStream inputStream = CreateReportUtil.class.getResourceAsStream("/excel/" + templateName + ".xlsx")) {

      if (inputStream == null) {
        throw new NotFoundException("Template not found in resources/templates_exports");
      }

      response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      response.setHeader("Content-Disposition", "attachment; filename=" + expotedFileName + ".xlsx");

      Context context = new Context(data);

      JxlsHelper.getInstance()
          .setProcessFormulas(false)
          .processTemplate(inputStream, response.getOutputStream(), context);

      response.flushBuffer();
    } catch (NullPointerException e) {
      throw new NotFoundException("Template" + templateName + " not found in resources/excel");
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
