/*
 * Copyright 2024 StarTree Inc
 *
 * Licensed under the StarTree Community License (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at http://www.startree.ai/legal/startree-community-license
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT * WARRANTIES OF ANY KIND,
 * either express or implied.
 * See the License for the specific language governing permissions and limitations under
 * the License.
 */
package ai.startree.thirdeye.resources;

import static ai.startree.thirdeye.ResourceUtils.ensureExists;
import static ai.startree.thirdeye.ResourceUtils.respondOk;

import ai.startree.thirdeye.auth.ThirdEyeServerPrincipal;
import ai.startree.thirdeye.service.AlertService;
import ai.startree.thirdeye.spi.Constants;
import ai.startree.thirdeye.spi.api.AlertApi;
import ai.startree.thirdeye.spi.api.AlertEvaluationApi;
import ai.startree.thirdeye.spi.api.AlertInsightsRequestApi;
import ai.startree.thirdeye.spi.datalayer.dto.AlertDTO;
import io.dropwizard.auth.Auth;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Tag(name = "Alert")
@SecurityRequirement(name = "oauth")
@SecurityRequirement(name = Constants.NAMESPACE_SECURITY)
@OpenAPIDefinition(security = {
    @SecurityRequirement(name = "oauth"),
    @SecurityRequirement(name = Constants.NAMESPACE_SECURITY)
})
@SecurityScheme(name = "oauth", type = SecuritySchemeType.APIKEY, in = SecuritySchemeIn.HEADER, paramName = HttpHeaders.AUTHORIZATION)
@SecurityScheme(name = Constants.NAMESPACE_SECURITY, type = SecuritySchemeType.APIKEY, in = SecuritySchemeIn.HEADER, paramName = Constants.NAMESPACE_HTTP_HEADER)
@Singleton
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AlertResource extends CrudResource<AlertApi, AlertDTO> {

  private static final Logger LOG = LoggerFactory.getLogger(AlertResource.class);
  public static final String EVALUATE_SWAGGER_EXAMPLE = "{\n"
      + "  \"alert\": {\n"
      + "    \"name\": \"alert-name\",\n"
      + "    \"description\": \"\",\n"
      + "    \"cron\": \"0 0 5 ? * * *\",\n"
      + "    \"template\": {\n"
      + "      \"name\": \"startree-ets\"\n"
      + "    },\n"
      + "    \"templateProperties\": {\n"
      + "      \"dataSource\": \"pinot\",\n"
      + "      \"dataset\": \"my-dataset\",\n"
      + "      \"aggregationColumn\": \"columnName\",\n"
      + "      \"aggregationFunction\": \"SUM\",\n"
      + "      \"seasonalityPeriod\": \"P7D\",\n"
      + "      \"lookback\": \"P28D\",\n"
      + "      \"monitoringGranularity\": \"P1D\",\n"
      + "      \"sensitivity\": \"3\"\n"
      + "    }\n"
      + "  },\n"
      + "  \"start\": 1685491200000,\n"
      + "  \"end\": 1686700800000\n"
      + "}";

  private final AlertService alertService;

  @Inject
  public AlertResource(final AlertService alertService) {
    super(alertService);
    this.alertService = alertService;
  }

  @Path("insights")
  @POST
  @Timed(percentiles = {0.5, 0.75, 0.90, 0.95, 0.98, 0.99, 0.999})
  @Produces(MediaType.APPLICATION_JSON)
  public Response getInsights(
      @Parameter(hidden = true) @Auth final ThirdEyeServerPrincipal principal,
      final AlertInsightsRequestApi request) {
    final AlertApi alert = request.getAlert();
    ensureExists(alert);
    return Response.ok(alertService.getInsights(principal, request)).build();
  }

  @Path("{id}/run")
  @POST
  @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
  @Timed(percentiles = {0.5, 0.75, 0.90, 0.95, 0.98, 0.99, 0.999})
  public Response runTask(
      @Parameter(hidden = true) @Auth final ThirdEyeServerPrincipal principal,
      @PathParam("id") final Long id,
      @FormParam("start") final Long startTime,
      @FormParam("end") final Long endTime
  ) {
    alertService.runTask(principal, id, startTime, endTime);
    return Response.ok().build();
  }

  @POST
  @Timed(percentiles = {0.5, 0.75, 0.90, 0.95, 0.98, 0.99, 0.999})
  @Path("/validate")
  @Produces(MediaType.APPLICATION_JSON)
  // can be moved to CrudResource if /validate is needed for other entities.
  public Response validateMultiple(
      @Parameter(hidden = true) @Auth final ThirdEyeServerPrincipal principal,
      final List<AlertApi> list) {
    ensureExists(list, "Invalid request");

    alertService.validateMultiple(principal, list);
    return Response.ok().build();
  }

  @Path("evaluate")
  @POST
  @Timed(percentiles = {0.5, 0.75, 0.90, 0.95, 0.98, 0.99, 0.999})
  public Response evaluate(
      @Parameter(hidden = true) @Auth final ThirdEyeServerPrincipal principal,
      @Schema(example = EVALUATE_SWAGGER_EXAMPLE) final AlertEvaluationApi request
  ) throws Exception {
    ensureExists(request.getStart(), "start");
    ensureExists(request.getEnd(), "end");
    ensureExists(request.getAlert(), "alert");

    return Response.ok(alertService.evaluate(principal, request)).build();
  }

  @Operation(summary = "Delete associated anomalies and rerun detection till present")
  @POST
  @Path("{id}/reset")
  @Timed(percentiles = {0.5, 0.75, 0.90, 0.95, 0.98, 0.99, 0.999})
  @Produces(MediaType.APPLICATION_JSON)
  public Response reset(
      @Parameter(hidden = true) @Auth final ThirdEyeServerPrincipal principal,
      @PathParam("id") final Long id) {
    return respondOk(alertService.reset(principal, id));
  }

  @GET
  @Timed(percentiles = {0.5, 0.75, 0.90, 0.95, 0.98, 0.99, 0.999})
  @Path("{id}/stats")
  @Produces(MediaType.APPLICATION_JSON)
  public Response stats(
      @Parameter(hidden = true) @Auth final ThirdEyeServerPrincipal principal,
      @PathParam("id") final Long id,
      @QueryParam("enumerationItem.id") final Long enumerationId,
      @QueryParam("startTime") final Long startTime,
      @QueryParam("endTime") final Long endTime
  ) {
    ensureExists(id);
    return respondOk(alertService.stats(principal, id, enumerationId, startTime, endTime));
  }
}
