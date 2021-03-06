package com.mycompany.jobs;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.TestDependencyFactory;
import com.mycompany.configuration.DependencyFactory;
import com.mycompany.models.OperationEnum;
import com.mycompany.models.AggregationModel;
import com.mycompany.models.ConfigModel;
import com.mycompany.services.ElasticsearchRepository;
import com.mycompany.services.MongodbRepository;
import org.apache.commons.io.FileUtils;
import org.apache.spark.sql.Column;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.apache.spark.sql.functions.*;
import static org.junit.Assert.assertEquals;

/**
 * This file tests the Job job methods.
 */
public class JobTests {
    @Mock
    MongodbRepository mongodbRepositoryMock;
    @Mock
    ElasticsearchRepository elasticsearchRepositoryMock;

    private Job job;
    private AggregationModel aggregationModel;
    ConfigModel configModel;

    /**
     * Initialize the test class, set up the environment and create mock objects.
     * @throws IOException
     */
    public JobTests() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        ClassLoader classLoader = getClass().getClassLoader();
        MockitoAnnotations.initMocks(this);
        DependencyFactory dependencyFactory = new TestDependencyFactory();
        SparkSession sparkSession = dependencyFactory.getSparkSession();
        configModel = dependencyFactory.getConfigModel();
        job = new TestJob(sparkSession, configModel, mongodbRepositoryMock, elasticsearchRepositoryMock);
        File aggregationsFile = new File(Objects.requireNonNull(classLoader.getResource("testAggregations.json")).getFile());
        String aggregationsFileContent = FileUtils.readFileToString(aggregationsFile, StandardCharsets.UTF_8);
        List<AggregationModel> aggregationModels = objectMapper.readValue(aggregationsFileContent, new TypeReference<List<AggregationModel>>(){});
        aggregationModel = aggregationModels.get(0);
    }

    /**
     * Should return the expected string given an AggregationModel ID and a date epoch.
     */
    @Test
    public void getElasticIndexName_returnAppropriateString() {
        long dateEpoch = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);
        String esIndexName = job.getElasticIndexName(aggregationModel._id, dateEpoch);
        assertEquals(String.format("%s_%d", aggregationModel._id, dateEpoch), esIndexName);
    }

    /**
     * Should return the expected string given an AggregationModel ID.
     */
    @Test
    public void getElasticIndexNamePrefix_returnAppropriateString() {
        String esIndexName = job.getElasticIndexNamePrefix(aggregationModel._id);
        assertEquals(String.format("%s", aggregationModel._id), esIndexName);
    }

    /**
     * Should return a list of columns matching the values of the list of operations in the input AggregationModel.
     * NOTE: The .toString() method of the lists is used to compare them because the actual objects have a subtle
     * package mismatch which changes their type and fails the test, even though the contents of the lists are the same.
     */
    @Test
    public void getOperationColumns_returnExpectedListOfColumns() {
        List<Column> actualColumns = job.getOperationColumns(aggregationModel);
        List<Column> expectedColumns = new ArrayList<Column>() {
            {
                add(count(aggregationModel.metricColumn).alias(OperationEnum.COUNT.toString().toLowerCase()));
                add(sum(aggregationModel.metricColumn).alias(OperationEnum.SUM.toString().toLowerCase()));
                add(max(aggregationModel.metricColumn).alias(OperationEnum.MAX.toString().toLowerCase()));
                add(min(aggregationModel.metricColumn).alias(OperationEnum.MIN.toString().toLowerCase()));
                add(avg(aggregationModel.metricColumn).alias(OperationEnum.AVG.toString().toLowerCase()));
            }
        };

        assertEquals(expectedColumns.toString(), actualColumns.toString());
    }

    /**
     * A simple Mock Job class used for reading test datasets.
     */
    static class TestJob extends Job {
        TestJob(SparkSession sparkSession, ConfigModel configModel, MongodbRepository mongodbRepository, ElasticsearchRepository elasticsearchRepository) {
            super(sparkSession, configModel, mongodbRepository, elasticsearchRepository);
            logger = LoggerFactory.getLogger(SchemaInferenceJob.class);
        }

        @Override
        public void run(String jobId, String userId) { }
    }
}